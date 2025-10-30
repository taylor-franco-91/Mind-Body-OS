// src/lib/exercises.ts
export type ExerciseMeta = {
    id: string;
    title: string;
    video?: string;      // replace with your real URLs later
    cues?: string[];
};

export const EXERCISES: Record<string, ExerciseMeta> = {
    press_overhead_dumbbell: {
        id: 'press_overhead_dumbbell',
        title: 'Dumbbell Overhead Press',
        video: 'https://videos.example/press_overhead_dumbbell.mp4',
        cues: ['Ribs down', 'Punch to sky', 'No shrug'],
    },
    row_dumbbell: {
        id: 'row_dumbbell',
        title: 'Dumbbell Row',
        video: 'https://videos.example/row_dumbbell.mp4',
        cues: ['Flat back', 'Pull to hip', 'Squeeze lats'],
    },
    pushup_standard: {
        id: 'pushup_standard',
        title: 'Push-up (Standard)',
        video: 'https://videos.example/pushup_standard.mp4',
        cues: ['Brace core', 'Elbows ~45°', 'Full lockout'],
    },
    farmer_carry: {
        id: 'farmer_carry',
        title: 'Farmer Carry',
        video: 'https://videos.example/farmer_carry.mp4',
        cues: ['Tall posture', 'Short fast steps', 'Don’t sway'],
    },
    plank_knees: {
        id: 'plank_knees',
        title: 'Plank (Knees)',
        video: 'https://videos.example/plank_knees.mp4',
    },
    plank_rkc: {
        id: 'plank_rkc',
        title: 'RKC Plank',
        video: 'https://videos.example/plank_rkc.mp4',
    },
    suitcase_carry_single: {
        id: 'suitcase_carry_single',
        title: 'Single-Arm Suitcase Carry',
        video: 'https://videos.example/suitcase_carry_single.mp4',
    },
    squat_bodyweight: {
        id: 'squat_bodyweight',
        title: 'Bodyweight Squat',
        video: 'https://videos.example/squat_bodyweight.mp4',
    },
    squat_goblet: {
        id: 'squat_goblet',
        title: 'Goblet Squat',
        video: 'https://videos.example/squat_goblet.mp4',
    },
    hinge_rdl_dumbbell: {
        id: 'hinge_rdl_dumbbell',
        title: 'DB Romanian Deadlift',
        video: 'https://videos.example/hinge_rdl_dumbbell.mp4',
    },
    pullup_band_assisted: {
        id: 'pullup_band_assisted',
        title: 'Band-Assisted Pull-up',
        video: 'https://videos.example/pullup_band_assisted.mp4',
    },
    walking_lunge_dumbbell: {
        id: 'walking_lunge_dumbbell',
        title: 'DB Walking Lunge',
        video: 'https://videos.example/walking_lunge_dumbbell.mp4',
    },
    press_half_kneeling_dumbbell: {
        id: 'press_half_kneeling_dumbbell',
        title: 'Half-Kneeling DB Press',
        video: 'https://videos.example/press_half_kneeling_dumbbell.mp4',
    },
    row_supported_chest: {
        id: 'row_supported_chest',
        title: 'Chest-Supported Row',
        video: 'https://videos.example/row_supported_chest.mp4',
    },
    glute_bridge_floor: {
        id: 'glute_bridge_floor',
        title: 'Glute Bridge (Floor)',
        video: 'https://videos.example/glute_bridge_floor.mp4',
    },
};
