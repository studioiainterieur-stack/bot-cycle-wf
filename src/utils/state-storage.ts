/**
 * State storage for GitHub Actions
 * Uses a simple JSON file in the repository to persist cycle states
 */

import { StoredCycleStates } from '../types/index.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the project root directory
// Use process.cwd() to get the actual working directory instead of relative paths
// This ensures the file is saved at the project root, not in dist/
const PROJECT_ROOT = process.cwd();
const STATE_FILE = join(PROJECT_ROOT, '.cycle-states.json');

/**
 * Load cycle states from file
 * Returns null if file doesn't exist or is invalid
 */
export function loadStates(): StoredCycleStates | null {
  try {
    if (!existsSync(STATE_FILE)) {
      console.log('📝 No previous state file found');
      return null;
    }
    
    const data = readFileSync(STATE_FILE, 'utf-8');
    const states = JSON.parse(data);
    console.log('✅ Loaded previous states from file');
    return states;
  } catch (error) {
    console.error('⚠️ Error loading states:', error);
    return null;
  }
}

/**
 * Save cycle states to file
 */
export function saveStates(states: StoredCycleStates): void {
  try {
    const data = JSON.stringify(states, null, 2);
    writeFileSync(STATE_FILE, data, 'utf-8');
    console.log('💾 Saved states to file');
  } catch (error) {
    console.error('⚠️ Error saving states:', error);
  }
}

