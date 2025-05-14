import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Note, Resource, PlagiarismDetail } from "./interfaces/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple plagiarism checking algorithm using text similarity
export function checkPlagiarism(studentAnswer: string, notes: Note[]): { 
  score: number;
  details: PlagiarismDetail[];
} {
  if (!studentAnswer || notes.length === 0) {
    return { score: 0, details: [] };
  }

  const normalizedStudentAnswer = normalizeText(studentAnswer);
  const details: PlagiarismDetail[] = [];
  let maxSimilarity = 0;

  notes.forEach(note => {
    const normalizedNoteContent = normalizeText(note.content);
    
    // Check for direct matches of phrases (5+ words)
    const studentPhrases = extractPhrases(normalizedStudentAnswer, 5);
    const notePhrases = extractPhrases(normalizedNoteContent, 5);
    
    const matchedPhrases: string[] = [];
    
    studentPhrases.forEach(phrase => {
      if (notePhrases.includes(phrase)) {
        matchedPhrases.push(phrase);
      }
    });
    
    // Calculate similarity based on matched phrases
    const phraseMatchScore = matchedPhrases.length > 0
      ? matchedPhrases.length / studentPhrases.length * 100
      : 0;
    
    // Calculate Jaccard similarity (word overlap)
    const studentWords = normalizedStudentAnswer.split(' ');
    const noteWords = normalizedNoteContent.split(' ');
    const studentWordsSet = new Set(studentWords);
    const noteWordsSet = new Set(noteWords);
    
    const intersection = new Set([...studentWordsSet].filter(x => noteWordsSet.has(x)));
    const union = new Set([...studentWordsSet, ...noteWordsSet]);
    
    const jaccardSimilarity = intersection.size / union.size * 100;
    
    // Combine scores - phrase matches weighted higher
    const similarity = 0.7 * phraseMatchScore + 0.3 * jaccardSimilarity;
    
    if (similarity > 10) { // Only report significant matches
      details.push({
        noteId: note.id,
        noteName: note.title,
        matchedText: matchedPhrases.slice(0, 3).join('... ') + (matchedPhrases.length > 3 ? '...' : ''),
        similarity: Math.round(similarity)
      });
      
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
  });

  return {
    score: Math.round(maxSimilarity),
    details: details.sort((a, b) => b.similarity - a.similarity)
  };
}

// Helper functions for plagiarism detection
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}

function extractPhrases(text: string, minWords: number): string[] {
  const words = text.split(' ');
  const phrases: string[] = [];
  
  for (let i = 0; i <= words.length - minWords; i++) {
    phrases.push(words.slice(i, i + minWords).join(' '));
  }
  
  return phrases;
}
