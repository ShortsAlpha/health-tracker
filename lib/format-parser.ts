
export interface ParsedMeal {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface ParsedWorkout {
    name: string;
    duration: number; // minutes
}

export interface ParsedDailyData {
    date: string;
    weight?: number;
    fat_rate?: number;
    muscle_rate?: number;
    water_rate?: number;
    meals: ParsedMeal[];
    workouts: ParsedWorkout[];
}

export function parseWeeklyText(text: string): ParsedDailyData[] {
    const lines = text.split('\n').map(l => l.trim());
    const result: ParsedDailyData[] = [];

    let currentDay: ParsedDailyData | null = null;
    let currentSection: 'METRICS' | 'MEALS' | 'WORKOUTS' | null = null;

    for (const line of lines) {
        if (!line) continue;

        // 1. Detect Date Header: === YYYY-MM-DD ===
        const dateMatch = line.match(/^={3,}\s*(\d{4}-\d{2}-\d{2})\s*={3,}$/);
        if (dateMatch) {
            if (currentDay) {
                result.push(currentDay);
            }
            currentDay = {
                date: dateMatch[1],
                meals: [],
                workouts: []
            };
            currentSection = null;
            continue;
        }

        if (!currentDay) continue;

        // 2. Detect Sections
        if (line.toUpperCase().startsWith('METRICS:')) {
            currentSection = 'METRICS';
            // Parse metrics inline if they are on the same line
            // METRICS: 80.5, 20.1, 55.4, 60.2
            const params = line.substring(8).trim();
            if (params) {
                parseMetricsLine(currentDay, params);
            }
            continue;
        } else if (line.toUpperCase().startsWith('MEALS:')) {
            currentSection = 'MEALS';
            continue;
        } else if (line.toUpperCase().startsWith('WORKOUTS:')) {
            currentSection = 'WORKOUTS';
            continue;
        }

        // 3. Parse Content based on section
        if (currentSection === 'METRICS') {
            // If metrics were not on the header line, they might be here
            parseMetricsLine(currentDay, line);
        } else if (currentSection === 'MEALS') {
            // Name | Cal | Prot | Carb | Fat
            const contentLine = line.startsWith('-') ? line.substring(1).trim() : line.trim();
            const parts = contentLine.split('|').map(p => p.trim());
            if (parts.length >= 2) {
                currentDay.meals.push({
                    name: parts[0],
                    calories: parseInt(parts[1]) || 0,
                    protein: parseFloat(parts[2]) || 0,
                    carbs: parseFloat(parts[3]) || 0,
                    fat: parseFloat(parts[4]) || 0
                });
            }
        } else if (currentSection === 'WORKOUTS') {
            // Name | Duration
            const contentLine = line.startsWith('-') ? line.substring(1).trim() : line.trim();
            const parts = contentLine.split('|').map(p => p.trim());
            if (parts.length >= 2) {
                currentDay.workouts.push({
                    name: parts[0],
                    duration: parseInt(parts[1]) || 0
                });
            }
        }
    }

    if (currentDay) {
        result.push(currentDay);
    }

    return result;
}

function parseMetricsLine(day: ParsedDailyData, line: string) {
    // Expected: weight, fat, muscle, water
    // Example: 80.5, 20.1, 55.4, 60.2
    const parts = line.split(',').map(p => parseFloat(p.trim()));
    if (parts.length > 0 && !isNaN(parts[0])) day.weight = parts[0];
    if (parts.length > 1 && !isNaN(parts[1])) day.fat_rate = parts[1];
    if (parts.length > 2 && !isNaN(parts[2])) day.muscle_rate = parts[2];
    if (parts.length > 3 && !isNaN(parts[3])) day.water_rate = parts[3];
}
