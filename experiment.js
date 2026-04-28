/*
 * experiment.js (improved version)
 *
 * This file defines a multi‑stimulus League of Legends cue search experiment
 * using jsPsych. It improves the user interface with cleaner layouts,
 * explanatory instructions for the confidence slider, a built‑in survey
 * shown before the task, and more explicit control over how the
 * confidence slider is updated. The slider now ranges from 100 to 100
 * with descriptive labels for each end and the midpoint. Participants
 * must move the slider after each cue reveal before they can reveal
 * another cue or make a final decision, preventing accidental clicks
 * from recording a confidence update.
 */

// Initialise jsPsych. Display collected data at the end for
// development. Replace displayData() with custom data handling in
// production.
const EDIT_MODE = new URLSearchParams(window.location.search).get('edit') === '1';
const app = document.getElementById('jspsych-target');
const jsPsych = initJsPsych({
  display_element: 'jspsych-target'
});

/*
 * Stimuli definition.
 * Each stimulus represents a single trial. To add more trials, append
 * additional objects to this array. Each cue may include an optional
 * `overlay` specifying the position and size of its opaque box as
 * percentages relative to the screenshot container. If no overlay is
 * provided, a default small box will be used.
 */
/*
 * Cue labeling convention (for data analysis):
 *   ally_portrait / enemy_portrait  — champion pool panels (left = ally in LoL HUD)
 *   ally_items / enemy_items        — item builds in the tab scoreboard
 *   ally_health_N / enemy_health_N  — individual HP bars numbered per trial
 *   scoreboard                      — top-center kill score
 *   minimap                         — bottom-right minimap
 *
 * Each stimulus includes `ally_side` ('blue' or 'red') so analysts know
 * which in-game side corresponds to "ally" for that trial.
 *
 * reveal_group determines what gets revealed together on a single click:
 *   'ally_portrait'  — both portrait strips at once (or split if desired)
 *   'enemy_portrait'
 *   'ally_items'
 *   'enemy_items'
 *   'ally_health'    — all ally HP bars at once
 *   'enemy_health'   — all enemy HP bars at once
 */
const TEAM_PREVIEWS = {
  swain_diana_blue: {
    acting_as: 'blue side',
    ally_team: ['Swain', 'Diana', 'Yasuo', 'Caitlyn', 'Seraphine'],
    enemy_team: ['Mordekaiser', 'Ekko', 'Corki', 'Ezreal', 'Leona']
  },
  ornn_kayn_blue: {
    acting_as: 'blue side',
    ally_team: ['Ornn', 'Kayn', 'Talon', 'Mel', 'Alistar'],
    enemy_team: ['Kayle', "Kha'Zix", 'Aurora', 'Xayah', 'Rakan']
  },
  ksante_talon_blue: {
    acting_as: 'blue side',
    ally_team: ["K'Sante", 'Talon', 'Fizz', 'Varus', 'Thresh'],
    enemy_team: ['Xin Zhao', 'Lee Sin', 'Jayce', 'Corki', 'Veigar']
  },
  ambessa_skarner_blue: {
    acting_as: 'blue side',
    ally_team: ['Ambessa', 'Skarner', 'Annie', 'Ashe', 'Lulu'],
    enemy_team: ['Renekton', 'Pantheon', 'Orianna', 'Yunara', 'Milio']
  }
};

const stimuli = [
{
  id: 'trial1',
  screenshot: 'assets/screenshot1.png',
  ally_side: 'blue',
  role_prompt: 'You are the blue-side shotcaller. What would you call here?',
  preview: TEAM_PREVIEWS.swain_diana_blue,
  baseline: {
    description:
      'Champion identities, lane positions, minion wave state, turrets and terrain are visible.'
  },
  cues: [
    { id: 'ally_portrait', label: 'Ally Champion Pool', reveal_group: 'ally_portrait', overlay: { top: '11.36%', left: '0.00%', width: '4.87%', height: '47.51%' } },
    { id: 'enemy_portrait', label: 'Enemy Champion Pool', reveal_group: 'enemy_portrait', overlay: { top: '12.46%', left: '95.48%', width: '4.66%', height: '47.27%' } },
    { id: 'ally_items', label: 'Ally Items', reveal_group: 'ally_items', overlay: { top: '79.48%', left: '31.35%', width: '16.28%', height: '20.26%' } },
    { id: 'enemy_items', label: 'Enemy Items', reveal_group: 'enemy_items', overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' } },
    { id: 'enemy_health_1', label: 'Enemy HP 1', reveal_group: 'enemy_health', overlay: { top: '42.17%', left: '44.22%', width: '7.82%', height: '2.38%' } },
    { id: 'enemy_health_2', label: 'Enemy HP 2', reveal_group: 'enemy_health', overlay: { top: '52.76%', left: '45.78%', width: '7.26%', height: '3.00%' } },
    { id: 'ally_health_1', label: 'Ally HP 1', reveal_group: 'ally_health', overlay: { top: '7.72%', left: '28.80%', width: '7.12%', height: '2.06%' } },
    { id: 'ally_health_2', label: 'Ally HP 2', reveal_group: 'ally_health', overlay: { top: '22.62%', left: '78.96%', width: '6.77%', height: '2.40%' } },
    { id: 'ally_health_3', label: 'Ally HP 3', reveal_group: 'ally_health', overlay: { top: '21.06%', left: '63.14%', width: '7.61%', height: '2.70%' } },
    { id: 'scoreboard', label: 'Scoreboard', overlay: { top: '0.00%', left: '22.03%', width: '56.73%', height: '4.65%' } },
    { id: 'minimap', label: 'Minimap', overlay: { top: '74.01%', left: '85.80%', width: '13.43%', height: '25.62%' } }
  ]
},
{
  id: 'trial2',
  screenshot: 'assets/screenshot2.png',
  ally_side: 'blue',
  role_prompt: 'You are the blue-side shotcaller. What would you call here?',
  preview: TEAM_PREVIEWS.ornn_kayn_blue,
  baseline: {
    description:
      'Your team composition, lane positioning and current health are shown. Turrets and minion waves are visible.'
  },
  cues: [
    { id: 'ally_portrait', label: 'Ally Champion Pool', reveal_group: 'ally_portrait', overlay: { top: '11.56%', left: '0.23%', width: '4.43%', height: '47.46%' } },
    { id: 'enemy_portrait', label: 'Enemy Champion Pool', reveal_group: 'enemy_portrait', overlay: { top: '11.75%', left: '95.28%', width: '4.48%', height: '48.01%' } },
    { id: 'ally_items', label: 'Ally Items', reveal_group: 'ally_items', overlay: { top: '79.08%', left: '31.17%', width: '16.50%', height: '20.69%' } },
    { id: 'enemy_items', label: 'Enemy Items', reveal_group: 'enemy_items', overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' } },
    { id: 'enemy_health_1', label: 'Enemy HP 1', reveal_group: 'enemy_health', overlay: { top: '15.55%', left: '44.46%', width: '6.89%', height: '2.17%' } },
    { id: 'enemy_health_2', label: 'Enemy HP 2', reveal_group: 'enemy_health', overlay: { top: '22.84%', left: '43.59%', width: '7.82%', height: '2.38%' } },
    { id: 'enemy_health_3', label: 'Enemy HP 3', reveal_group: 'enemy_health', overlay: { top: '24.06%', left: '48.25%', width: '7.93%', height: '2.58%' } },
    { id: 'enemy_health_4', label: 'Enemy HP 4', reveal_group: 'enemy_health', overlay: { top: '22.19%', left: '48.10%', width: '7.04%', height: '2.17%' } },
    { id: 'ally_health_1', label: 'Ally HP 1', reveal_group: 'ally_health', overlay: { top: '50.23%', left: '40.13%', width: '7.17%', height: '2.06%' } },
    { id: 'ally_health_2', label: 'Ally HP 2', reveal_group: 'ally_health', overlay: { top: '21.90%', left: '81.53%', width: '6.59%', height: '1.85%' } },
    { id: 'ally_health_3', label: 'Ally HP 3', reveal_group: 'ally_health', overlay: { top: '54.10%', left: '66.20%', width: '6.54%', height: '2.17%' } },
    { id: 'ally_health_4', label: 'Ally HP 4', reveal_group: 'ally_health', overlay: { top: '89.07%', left: '17.07%', width: '7.12%', height: '2.59%' } },
    { id: 'ally_health_5', label: 'Ally HP 5', reveal_group: 'ally_health', overlay: { top: '45.04%', left: '23.12%', width: '7.81%', height: '2.06%' } },
    { id: 'scoreboard', label: 'Scoreboard', overlay: { top: '0.00%', left: '22.03%', width: '56.73%', height: '4.65%' } },
    { id: 'minimap', label: 'Minimap', overlay: { top: '73.99%', left: '84.90%', width: '14.33%', height: '26.41%' } }
  ]
},
  {
    id: 'trial3',
    screenshot: 'assets/screenshot3.png',
    ally_side: 'blue',
    role_prompt: 'You are the blue-side shotcaller. What would you call here?',
    preview: TEAM_PREVIEWS.ksante_talon_blue,
    baseline: {
      description:
        'Champion identities, lane positions, minion wave state, turrets and terrain are visible.'
    },
    cues: [
      { id: 'ally_portrait', label: 'Ally Champion Pool', reveal_group: 'ally_portrait', overlay: { top: '12.33%', left: '0.00%', width: '4.77%', height: '46.86%' } },
      { id: 'enemy_portrait', label: 'Enemy Champion Pool', reveal_group: 'enemy_portrait', overlay: { top: '12.44%', left: '95.42%', width: '4.26%', height: '46.98%' } },
      { id: 'ally_items', label: 'Ally Items', reveal_group: 'ally_items', overlay: { top: '79.43%', left: '31.19%', width: '16.20%', height: '19.65%' } },
      { id: 'enemy_items', label: 'Enemy Items', reveal_group: 'enemy_items', overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' } },
      { id: 'ally_health_1', label: 'Ally HP 1', reveal_group: 'ally_health', overlay: { top: '33.56%', left: '47.33%', width: '7.50%', height: '2.50%' } },
      { id: 'enemy_health_1', label: 'Enemy HP 1', reveal_group: 'enemy_health', overlay: { top: '44.42%', left: '41.50%', width: '7.50%', height: '2.50%' } },
      { id: 'scoreboard', label: 'Scoreboard', overlay: { top: '0.00%', left: '22.03%', width: '56.73%', height: '4.65%' } },
      { id: 'minimap', label: 'Minimap', overlay: { top: '74.10%', left: '84.93%', width: '14.36%', height: '25.35%' } }
    ]
  },
  {
    id: 'trial4',
    screenshot: 'assets/screenshot4.png',
    ally_side: 'blue',
    role_prompt: 'You are the blue-side shotcaller. What would you call here?',
    preview: TEAM_PREVIEWS.ornn_kayn_blue,
    baseline: {
      description:
        'Champion identities, lane positions, minion wave state, turrets and terrain are visible.'
    },
    cues: [
      { id: 'ally_portrait', label: 'Ally Champion Pool', reveal_group: 'ally_portrait', overlay: { top: '11.34%', left: '0.00%', width: '4.99%', height: '47.83%' } },
      { id: 'enemy_portrait', label: 'Enemy Champion Pool', reveal_group: 'enemy_portrait', overlay: { top: '12.44%', left: '95.31%', width: '4.37%', height: '46.56%' } },
      { id: 'ally_items', label: 'Ally Items', reveal_group: 'ally_items', overlay: { top: '79.39%', left: '29.64%', width: '17.87%', height: '20.03%' } },
      { id: 'enemy_items', label: 'Enemy Items', reveal_group: 'enemy_items', overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' } },
      { id: 'ally_health_1', label: 'Ally HP 1', reveal_group: 'ally_health', overlay: { top: '54.50%', left: '43.50%', width: '7.50%', height: '2.50%' } },
      { id: 'ally_health_2', label: 'Ally HP 2', reveal_group: 'ally_health', overlay: { top: '33.02%', left: '37.94%', width: '7.50%', height: '2.50%' } },
      { id: 'enemy_health_1', label: 'Enemy HP 1', reveal_group: 'enemy_health', overlay: { top: '38.70%', left: '53.20%', width: '7.50%', height: '2.50%' } },
      { id: 'enemy_health_2', label: 'Enemy HP 2', reveal_group: 'enemy_health', overlay: { top: '54.50%', left: '47.70%', width: '7.50%', height: '2.50%' } },
      { id: 'scoreboard', label: 'Scoreboard', overlay: { top: '0.00%', left: '22.03%', width: '56.73%', height: '4.65%' } },
      { id: 'minimap', label: 'Minimap', overlay: { top: '74.07%', left: '85.71%', width: '13.58%', height: '26.13%' } }
    ]
  },
  {
    id: 'trial5',
    screenshot: 'assets/screenshot5.png',
    ally_side: 'blue',
    role_prompt: 'You are the blue-side shotcaller. What would you call here?',
    preview: TEAM_PREVIEWS.ornn_kayn_blue,
    baseline: {
      description:
        'Champion identities, lane positions, minion wave state, turrets and terrain are visible.'
    },
    cues: [
      { id: 'ally_portrait', label: 'Ally Champion Pool', reveal_group: 'ally_portrait', overlay: { top: '11.34%', left: '0.00%', width: '4.99%', height: '47.83%' } },
      { id: 'enemy_portrait', label: 'Enemy Champion Pool', reveal_group: 'enemy_portrait', overlay: { top: '12.45%', left: '94.97%', width: '5.05%', height: '45.61%' } },
      { id: 'ally_items', label: 'Ally Items', reveal_group: 'ally_items', overlay: { top: '79.23%', left: '31.75%', width: '15.87%', height: '20.23%' } },
      { id: 'enemy_items', label: 'Enemy Items', reveal_group: 'enemy_items', overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' } },
      { id: 'ally_health_1', label: 'Ally HP 1', reveal_group: 'ally_health', overlay: { top: '50.40%', left: '70.84%', width: '7.50%', height: '2.50%' } },
      { id: 'ally_health_2', label: 'Ally HP 2', reveal_group: 'ally_health', overlay: { top: '32.20%', left: '26.70%', width: '7.50%', height: '2.50%' } },
      { id: 'enemy_health_1', label: 'Enemy HP 1', reveal_group: 'enemy_health', overlay: { top: '18.56%', left: '39.89%', width: '7.50%', height: '2.50%' } },
      { id: 'scoreboard', label: 'Scoreboard', overlay: { top: '0.00%', left: '22.03%', width: '56.73%', height: '4.65%' } },
      { id: 'minimap', label: 'Minimap', overlay: { top: '74.10%', left: '85.48%', width: '13.80%', height: '25.75%' } }
    ]
  },
{
  id: 'trial6',
  screenshot: 'assets/screenshot6.png',
  ally_side: 'blue',
  role_prompt: 'You are the blue-side shotcaller. What would you call here?',
  preview: TEAM_PREVIEWS.ambessa_skarner_blue,
  baseline: {
    description:
      'Champion identities, lane positions, minion wave state, turrets and terrain are visible.'
  },
  cues: [
    { id: 'ally_portrait', label: 'Ally Champion Pool', reveal_group: 'ally_portrait', overlay: { top: '11.34%', left: '0.00%', width: '4.99%', height: '47.83%' } },
    { id: 'enemy_portrait', label: 'Enemy Champion Pool', reveal_group: 'enemy_portrait', overlay: { top: '12.06%', left: '95.20%', width: '5.05%', height: '46.42%' } },
    { id: 'ally_items', label: 'Ally Items', reveal_group: 'ally_items', overlay: { top: '79.39%', left: '31.19%', width: '15.98%', height: '20.23%' } },
    { id: 'enemy_items', label: 'Enemy Items', reveal_group: 'enemy_items', overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' } },
    { id: 'ally_health_1', label: 'Ally HP 1', reveal_group: 'ally_health', overlay: { top: '32.48%', left: '40.93%', width: '7.50%', height: '2.50%' } },
    { id: 'enemy_health_1', label: 'Enemy HP 1', reveal_group: 'enemy_health', overlay: { top: '35.67%', left: '47.86%', width: '7.50%', height: '2.50%' } },
    { id: 'scoreboard', label: 'Scoreboard', overlay: { top: '0.00%', left: '22.03%', width: '56.73%', height: '4.65%' } },
    { id: 'minimap', label: 'Minimap', overlay: { top: '74.14%', left: '85.60%', width: '14.36%', height: '25.76%' } }
  ]
}
];

// High‑resolution timer for timestamps.
const experimentStart = performance.now();

function cueRevealGroup(cue) {
  return cue.reveal_group || cue.revealGroup || cue.id;
}

function cuesTriggeredByClick(stimulus, clickedCueId) {
  const clickedCue = stimulus.cues.find((cue) => cue.id === clickedCueId);
  if (!clickedCue) return [clickedCueId];
  const group = cueRevealGroup(clickedCue);
  return stimulus.cues
    .filter((cue) => cueRevealGroup(cue) === group)
    .map((cue) => cue.id);
}

function uniquePushAll(targetArray, values) {
  values.forEach((value) => {
    if (!targetArray.includes(value)) targetArray.push(value);
  });
}

function downloadTextFile(filename, text) {
  const lowercaseFilename = filename.toLowerCase();
  const mimeType = lowercaseFilename.endsWith('.csv')
    ? 'text/csv;charset=utf-8'
    : lowercaseFilename.endsWith('.tsv')
      ? 'text/tab-separated-values;charset=utf-8'
      : 'text/plain;charset=utf-8';
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function pct(value) {
  return `${value.toFixed(2)}%`;
}

const DEFAULT_CUE_OVERLAY = {
  top: '4.00%',
  left: '4.00%',
  width: '12.00%',
  height: '12.00%'
};
const DEFAULT_SCENARIO_DESCRIPTION = 'Add scenario context here.';
const DEFAULT_PRIOR_CONTEXT = 'No additional prior context was provided for this scenario.';
const RESULT_FIELD_DELIMITER = '\t';
const RESULT_LINE_DELIMITER = '\r\n';
const LIVE_TRIAL_DURATION_SEC = 60;
const MIN_RATIONALE_WORDS = 8;

const tutorialStimulusSeed = {
  id: 'tutorial_practice',
  is_tutorial: true,
  screenshot: 'assets/screenshot2.png',
  ally_side: 'blue',
  role_prompt: 'Tutorial round: practice the task flow.',
  preview: TEAM_PREVIEWS.ornn_kayn_blue,
  baseline: {
    description:
      'This warm-up round is only for practice. Learn how block reveals, confidence updates, prior context, and final decisions work before the timed trials start.',
    prior_context:
      'Example prior context: the enemy jungler was seen pathing bot-side 12 seconds ago, your support just used Flash, and the next allied wave will arrive first.'
  },
  cues: [
    { id: 'scoreboard', label: 'Scoreboard', overlay: { top: '0.00%', left: '22.03%', width: '56.73%', height: '4.65%' } },
    { id: 'ally_items', label: 'Ally Items', reveal_group: 'ally_items', overlay: { top: '79.48%', left: '31.35%', width: '16.28%', height: '20.26%' } },
    { id: 'enemy_items', label: 'Enemy Items', reveal_group: 'enemy_items', overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' } },
    { id: 'minimap', label: 'Minimap', overlay: { top: '74.04%', left: '83.71%', width: '15.58%', height: '25.53%' } }
  ]
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCueOverlay(cue) {
  return {
    ...DEFAULT_CUE_OVERLAY,
    ...(cue?.overlay ?? {})
  };
}

function getScenarioDescription(stimulus) {
  const description = stimulus?.baseline?.description;
  return typeof description === 'string' && description.trim()
    ? description.trim()
    : DEFAULT_SCENARIO_DESCRIPTION;
}

function getPriorContext(stimulus) {
  const priorContext = stimulus?.baseline?.prior_context;
  if (typeof priorContext === 'string' && priorContext.trim()) {
    return priorContext.trim();
  }

  const scenarioDescription = getScenarioDescription(stimulus);
  return scenarioDescription !== DEFAULT_SCENARIO_DESCRIPTION
    ? scenarioDescription
    : DEFAULT_PRIOR_CONTEXT;
}

function buildPriorContextMarkup(stimulus, suffix = 'default', options = {}) {
  const panelId = `prior-context-panel-${suffix}`;
  const buttonLabel = options.buttonLabel || 'Prior context';

  return `
    <div class="prior-context-anchor">
      <div class="prior-context-wrap prior-context-floating">
        <button
          type="button"
          class="prior-context-toggle"
          aria-label="${escapeHtml(buttonLabel)}"
          title="${escapeHtml(buttonLabel)}"
          aria-expanded="false"
          aria-controls="${panelId}"
        >
          <span class="prior-context-toggle-mark">?</span>
        </button>
      </div>
      <div id="${panelId}" class="prior-context-panel" hidden>
        ${escapeHtml(getPriorContext(stimulus))}
      </div>
    </div>
  `;
}

function ensureStimulusDefaults(stimulus) {
  if (!stimulus.baseline) stimulus.baseline = {};
  if (!stimulus.baseline.description) stimulus.baseline.description = DEFAULT_SCENARIO_DESCRIPTION;

  stimulus.cues.forEach((cue) => {
    cue.overlay = getCueOverlay(cue);
  });

  return stimulus;
}

stimuli.forEach(ensureStimulusDefaults);
const tutorialStimulus = ensureStimulusDefaults(tutorialStimulusSeed);

function countWords(text) {
  return String(text ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function getCueLabel(stimulus, cueId) {
  return stimulus.cues.find((cue) => cue.id === cueId)?.label || cueId;
}

function joinNaturalLanguage(items) {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function getStimulusPreview(stimulus) {
  const fallbackSide = stimulus?.ally_side === 'red' ? 'red side' : 'blue side';
  return {
    acting_as: stimulus?.preview?.acting_as || fallbackSide,
    ally_team: Array.isArray(stimulus?.preview?.ally_team) ? stimulus.preview.ally_team : [],
    enemy_team: Array.isArray(stimulus?.preview?.enemy_team) ? stimulus.preview.enemy_team : []
  };
}

function championListMarkup(champions) {
  if (!champions.length) {
    return '<p class="text-muted">Champion list pending review.</p>';
  }

  return `
    <div class="champion-pill-list">
      ${champions.map((champion) => `<span class="champion-pill">${escapeHtml(champion)}</span>`).join('')}
    </div>
  `;
}

function buildTrialPreview(stimulus, options = {}) {
  const preview = getStimulusPreview(stimulus);
  const isTutorial = options.isTutorial === true || Boolean(stimulus.is_tutorial);
  const actingAs = preview.acting_as;

  return {
    type: jsPsychHtmlButtonResponse,
    choices: [isTutorial ? 'Start practice round' : 'Start trial'],
    stimulus: `
      <div class="screen-wrap trial-preview-screen">
        <div class="trial-preview-card">
          <div class="trial-preview-kicker">${isTutorial ? 'Practice preview' : 'Trial preview'}</div>
          <h2>Get ready to make the call</h2>
          <p class="trial-preview-lede">
            You will be the shot caller for the <strong>${escapeHtml(actingAs)}</strong>.
            You will decide whether to <strong>Fight</strong> or <strong>Don't Fight</strong>.
          </p>
          <div class="preview-teams">
            <section class="preview-team preview-team-ally">
              <h3>Your team</h3>
              ${championListMarkup(preview.ally_team)}
            </section>
            <section class="preview-team preview-team-enemy">
              <h3>Enemy team</h3>
              ${championListMarkup(preview.enemy_team)}
            </section>
          </div>
          <p class="trial-preview-note">
            Review the teams now so the screenshot can be used for the actual decision.
          </p>
        </div>
      </div>
    `,
    data: {
      stimulus_id: stimulus.id,
      phase: 'trial_preview',
      is_tutorial: isTutorial,
      acting_as: actingAs,
      ally_team: preview.ally_team.join(', '),
      enemy_team: preview.enemy_team.join(', ')
    }
  };
}

function formatRevealSummary(stimulus, revealedIds) {
  const labels = revealedIds.map((cueId) => getCueLabel(stimulus, cueId));
  return joinNaturalLanguage(labels);
}

function spreadsheetEscape(value) {
  const stringValue = value == null
    ? ''
    : String(value)
      .replace(/\r\n|\n|\r/g, ' / ')
      .replace(/\t/g, ' ');
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function safeJsonParse(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function flattenRevealOrder(revealOrder) {
  return revealOrder.map((entry) => entry.cue_id).join(' | ');
}

function flattenRevealGroups(revealOrder) {
  return revealOrder.map((entry) => entry.reveal_group || '').join(' | ');
}

function flattenRevealedCueSets(revealOrder) {
  return revealOrder
    .map((entry) => Array.isArray(entry.revealed_cue_ids) ? entry.revealed_cue_ids.join('&') : '')
    .join(' | ');
}

function flattenRevealTimes(revealOrder) {
  return revealOrder.map((entry) => (Number(entry.time) || 0).toFixed(2)).join(' | ');
}

function getFirstRevealTime(revealOrder) {
  if (!Array.isArray(revealOrder) || revealOrder.length === 0) return '';
  return (Number(revealOrder[0]?.time) || 0).toFixed(2);
}

function flattenContextViewPhases(contextViews) {
  return contextViews.map((entry) => entry.phase || '').join(' | ');
}

function flattenContextViewTimes(contextViews) {
  return contextViews.map((entry) => (Number(entry.time) || 0).toFixed(2)).join(' | ');
}

function getJatosMetadata() {
  if (typeof jatos === 'undefined') {
    return {
      worker_id: '',
      study_id: '',
      study_result_id: '',
      component_id: '',
      component_result_id: ''
    };
  }

  return {
    worker_id: jatos.workerId ?? '',
    study_id: jatos.studyId ?? '',
    study_result_id: jatos.studyResultId ?? '',
    component_id: jatos.componentId ?? '',
    component_result_id: jatos.componentResultId ?? ''
  };
}

function buildSpreadsheetResult() {
  const rows = jsPsych.data.get().values();
  const surveyResponse = rows.find((row) => row.trial_type === 'survey-text')?.response ?? {};
  const decisionRows = rows.filter((row) => row.event_type === 'decision' && !row.is_tutorial);
  const metadata = getJatosMetadata();
  const headers = [
    'worker_id',
    'study_id',
    'study_result_id',
    'component_id',
    'component_result_id',
    'stimulus_id',
    'ally_side',
    'screenshot',
    'role_prompt',
    'scenario_description',
    'prior_context',
    'decision',
    'decision_source',
    'final_confidence',
    'rationale',
    'decision_rt_ms',
    'decision_timestamp_sec',
    'timed_out',
    'trial_duration_sec',
    'num_blocks_opened',
    'first_reveal_time_sec',
    'final_seen_state',
    'last_confidence_before_timeout',
    'final_confidence_post_timeout',
    'num_cues_revealed',
    'cues_revealed',
    'reveal_click_order',
    'reveal_groups',
    'revealed_cue_sets',
    'overlay_confidence_sequence',
    'reveal_timestamps_sec',
    'context_opened',
    'num_context_views',
    'context_view_phases',
    'context_view_timestamps_sec',
    'survey_rank',
    'survey_current_rank',
    'survey_opgg',
    'survey_hours_per_week',
    'survey_playstyle',
    'survey_primary_role',
    'survey_otp',
    'survey_competitive_experience'
  ];

  const spreadsheetRows = decisionRows.map((row) => {
    const revealOrder = safeJsonParse(row.reveal_order, []);
    const cuesRevealed = safeJsonParse(row.cues_revealed, []);
    const revealConfidence = safeJsonParse(row.reveal_confidence, []);
    const contextViews = safeJsonParse(row.context_views, []);
    const stimulusMeta = stimuli.find((stimulus) => stimulus.id === row.stimulus_id) ?? {};

    return [
      metadata.worker_id,
      metadata.study_id,
      metadata.study_result_id,
      metadata.component_id,
      metadata.component_result_id,
      row.stimulus_id ?? '',
      stimulusMeta.ally_side ?? '',
      stimulusMeta.screenshot ?? '',
      stimulusMeta.role_prompt ?? '',
      getScenarioDescription(stimulusMeta),
      getPriorContext(stimulusMeta),
      row.decision ?? '',
      row.decision_source ?? '',
      row.confidence ?? '',
      row.rationale ?? '',
      row.rt ?? '',
      (Number(row.time) || 0).toFixed(2),
      row.timed_out ?? '0',
      row.trial_duration_sec ?? '',
      revealOrder.length,
      getFirstRevealTime(revealOrder),
      Array.isArray(cuesRevealed) ? cuesRevealed.join(' | ') : '',
      row.last_confidence_before_timeout ?? '',
      row.final_confidence_post_timeout ?? '',
      row.num_cues_revealed ?? 0,
      Array.isArray(cuesRevealed) ? cuesRevealed.join(' | ') : '',
      flattenRevealOrder(revealOrder),
      flattenRevealGroups(revealOrder),
      flattenRevealedCueSets(revealOrder),
      Array.isArray(revealConfidence) ? revealConfidence.join(' | ') : '',
      flattenRevealTimes(revealOrder),
      contextViews.length > 0 ? '1' : '0',
      row.num_context_views ?? contextViews.length,
      flattenContextViewPhases(contextViews),
      flattenContextViewTimes(contextViews),
      surveyResponse.rank ?? '',
      surveyResponse.current_rank ?? '',
      surveyResponse.opgg ?? '',
      surveyResponse.hours ?? '',
      surveyResponse.playstyle ?? '',
      surveyResponse.role ?? '',
      surveyResponse.otp ?? '',
      surveyResponse.competitive ?? ''
    ].map(spreadsheetEscape).join(RESULT_FIELD_DELIMITER);
  });

  return [
    headers.map(spreadsheetEscape).join(RESULT_FIELD_DELIMITER),
    ...spreadsheetRows
  ].join(RESULT_LINE_DELIMITER);
}

function renderCalibrationApp() {
  let currentStimulusIndex = 0;
  let activeCueId = null;

  function currentStimulus() {
    return stimuli[currentStimulusIndex];
  }

  function buildOverlayBox(cue) {
    const overlay = getCueOverlay(cue);
    const isActive = activeCueId === cue.id;
    return `
      <div
        class="cue-overlay calibration-box"
        data-cue-id="${cue.id}"
        style="
          top:${overlay.top};
          left:${overlay.left};
          width:${overlay.width};
          height:${overlay.height};
          outline:${isActive ? '2px solid #4da3ff' : '1px solid rgba(255,255,255,0.35)'};
          cursor: move;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:visible;
        "
      >
        <span class="cue-overlay-label">${escapeHtml(cue.id)}</span>
        <div class="resize-handle corner-tl" data-corner="tl" data-resize-id="${cue.id}"></div>
        <div class="resize-handle corner-tr" data-corner="tr" data-resize-id="${cue.id}"></div>
        <div class="resize-handle corner-bl" data-corner="bl" data-resize-id="${cue.id}"></div>
        <div class="resize-handle corner-br" data-corner="br" data-resize-id="${cue.id}"></div>
      </div>
    `;
  }

  function codeString(value) {
    return `'${String(value ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")}'`;
  }

  function formatCueForCode(cue, indent = '      ') {
    const cueParts = [
      `id: ${codeString(cue.id)}`,
      cue.label ? `label: ${codeString(cue.label)}` : null,
      cue.reveal_group ? `reveal_group: ${codeString(cue.reveal_group)}` : null,
      cue.present === false ? 'present: false' : null,
      `overlay: { top: ${codeString(cue.overlay?.top ?? '0%')}, left: ${codeString(cue.overlay?.left ?? '0%')}, width: ${codeString(cue.overlay?.width ?? '10%')}, height: ${codeString(cue.overlay?.height ?? '10%')} }`
    ].filter(Boolean);

    return `${indent}{ ${cueParts.join(', ')} }`;
  }

  function formatCueArrayForCode(cues, baseIndent = '    ') {
    const cueIndent = baseIndent + '  ';
    return `${baseIndent}cues: [\n${cues.map((cue) => formatCueForCode(cue, cueIndent)).join(',\n')}\n${baseIndent}]`;
  }

  function formatStimulusForCode(stimulus, baseIndent = '') {
    const innerIndent = baseIndent + '  ';
    const preview = getStimulusPreview(stimulus);
    const previewLines = [];
    if (preview.ally_team.length || preview.enemy_team.length) {
      const formatChampionArray = (champions) => `[${champions.map(codeString).join(', ')}]`;
      previewLines.push(
        `${innerIndent}preview: {`,
        `${innerIndent}  acting_as: ${codeString(preview.acting_as)},`,
        `${innerIndent}  ally_team: ${formatChampionArray(preview.ally_team)},`,
        `${innerIndent}  enemy_team: ${formatChampionArray(preview.enemy_team)}`,
        `${innerIndent}},`
      );
    }

    const baselineLines = [
      `${innerIndent}baseline: {`,
      `${innerIndent}  description:`,
      `${innerIndent}    ${codeString(getScenarioDescription(stimulus))}${stimulus?.baseline?.prior_context ? ',' : ''}`
    ];

    if (stimulus?.baseline?.prior_context) {
      baselineLines.push(
        `${innerIndent}  prior_context:`,
        `${innerIndent}    ${codeString(getPriorContext(stimulus))}`
      );
    }

    baselineLines.push(`${innerIndent}},`);

    return [
      `${baseIndent}{`,
      `${innerIndent}id: ${codeString(stimulus.id)},`,
      `${innerIndent}screenshot: ${codeString(stimulus.screenshot)},`,
      `${innerIndent}ally_side: ${codeString(stimulus.ally_side ?? 'blue')},`,
      `${innerIndent}role_prompt: ${codeString(stimulus.role_prompt ?? '')},`,
      ...previewLines,
      ...baselineLines,
      formatCueArrayForCode(stimulus.cues, innerIndent),
      `${baseIndent}}`
    ].join('\n');
  }

  function formatAllStimuliForCode(stimuliArray) {
    return stimuliArray.map((stimulus) => formatStimulusForCode(stimulus)).join(',\n');
  }

  function currentStimulusOverlayCode() {
    return formatStimulusForCode(currentStimulus());
  }

  function allStimuliOverlayCode() {
    return formatAllStimuliForCode(stimuli);
  }

  function rerender() {
    const stimulus = currentStimulus();
    app.innerHTML = `
      <div class="editor-panel center-wrap">
        <h2>Overlay calibration mode</h2>
        <p class="hint">
          This mode only appears at <code>?edit=1</code>. Participants cannot drag or resize boxes.
        </p>
        <div class="editor-toolbar">
          <button id="prev-stimulus" class="jspsych-btn">Previous stimulus</button>
          <strong>${stimulus.id}</strong>
          <button id="next-stimulus" class="jspsych-btn">Next stimulus</button>
          <button id="copy-current" class="jspsych-btn">Copy current stimulus code</button>
          <button id="copy-all" class="jspsych-btn">Copy all stimuli code</button>
          <button id="export-current" class="jspsych-btn">Export current stimulus code</button>
          <button id="export-all" class="jspsych-btn">Export all stimuli code</button>
        </div>
        <p class="hint">
          Drag a box to move it. Drag any gold corner handle to resize from that corner.
        </p>
        <div class="screen-wrap">
          <h3>${escapeHtml(stimulus.role_prompt)}</h3>
          <div class="screenshot-container" id="calibration-container">
            <img src="${stimulus.screenshot}" alt="League screenshot" />
            ${stimulus.cues.map(buildOverlayBox).join('')}
          </div>
        </div>
        <div class="editor-panel">
          <h4>Prior context</h4>
          <label for="prior-context-editor">Participant-facing prior context for ${escapeHtml(stimulus.id)}</label>
          <textarea
            id="prior-context-editor"
            class="editor-textarea"
            rows="5"
            placeholder="Type the prior context for this stimulus..."
          >${escapeHtml(stimulus?.baseline?.prior_context || '')}</textarea>
          <p class="hint">Leave blank to use the default fallback. Changes here update the export text below.</p>
        </div>
        <div class="editor-panel">
          <h4>Selected cue</h4>
          <div id="selected-cue-readout">${activeCueId || 'None selected'}</div>
          <textarea id="overlay-output" class="copy-output">${currentStimulusOverlayCode()}</textarea>
          <p class="warning-text">After calibrating, copy the code and save it back into your source file.</p>
        </div>
      </div>
    `;

    const container = document.getElementById('calibration-container');
    const output = document.getElementById('overlay-output');
    const priorContextEditor = document.getElementById('prior-context-editor');

    let outputSyncFrame = null;

    function syncOutputNow() {
      output.value = currentStimulusOverlayCode();
      outputSyncFrame = null;
    }

    function scheduleOutputSync() {
      if (outputSyncFrame !== null) return;
      outputSyncFrame = window.requestAnimationFrame(syncOutputNow);
    }

    function updateCueBoxStyles(box, cue) {
      const overlay = getCueOverlay(cue);
      box.style.top = overlay.top;
      box.style.left = overlay.left;
      box.style.width = overlay.width;
      box.style.height = overlay.height;
    }

    document.getElementById('prev-stimulus').onclick = () => {
      currentStimulusIndex = (currentStimulusIndex - 1 + stimuli.length) % stimuli.length;
      activeCueId = null;
      rerender();
    };

    document.getElementById('next-stimulus').onclick = () => {
      currentStimulusIndex = (currentStimulusIndex + 1) % stimuli.length;
      activeCueId = null;
      rerender();
    };

    document.getElementById('copy-current').onclick = async () => {
      syncOutputNow();
      try {
        await navigator.clipboard.writeText(output.value);
      } catch (err) { }
    };

    document.getElementById('copy-all').onclick = async () => {
      output.value = allStimuliOverlayCode();
      try {
        await navigator.clipboard.writeText(output.value);
      } catch (err) { }
    };

    document.getElementById('export-current').onclick = () => {
      syncOutputNow();
      downloadTextFile(`${stimulus.id}-overlays.js`, output.value);
    };

    document.getElementById('export-all').onclick = () => {
      output.value = allStimuliOverlayCode();
      downloadTextFile('all-stimuli-overlays.js', output.value);
    };

    if (priorContextEditor) {
      priorContextEditor.addEventListener('input', () => {
        const nextPriorContext = priorContextEditor.value.trim();
        if (!stimulus.baseline) stimulus.baseline = {};
        if (nextPriorContext) {
          stimulus.baseline.prior_context = nextPriorContext;
        } else {
          delete stimulus.baseline.prior_context;
        }
        scheduleOutputSync();
      });
    }

    const boxes = container.querySelectorAll('.calibration-box');

    function setActiveCue(cueId) {
      activeCueId = cueId;
      const readout = document.getElementById('selected-cue-readout');
      if (readout) readout.textContent = cueId || 'None selected';
      boxes.forEach((candidate) => {
        candidate.style.outline =
          candidate.dataset.cueId === cueId
            ? '2px solid #4da3ff'
            : '1px solid rgba(255,255,255,0.35)';
      });
    }

    boxes.forEach((box) => {
      const cueId = box.dataset.cueId;
      const cue = stimulus.cues.find((c) => c.id === cueId);
      const handles = box.querySelectorAll('.resize-handle');

      function startPointerInteraction(pointerTarget, pointerDownEvent, computeNextOverlay) {
        pointerDownEvent.preventDefault();
        setActiveCue(cueId);

        const pointerId = pointerDownEvent.pointerId;
        if (pointerTarget.setPointerCapture) {
          pointerTarget.setPointerCapture(pointerId);
        }

        function onPointerMove(moveEvent) {
          if (moveEvent.pointerId !== pointerId) return;
          moveEvent.preventDefault();
          cue.overlay = computeNextOverlay(moveEvent);
          updateCueBoxStyles(box, cue);
          scheduleOutputSync();
        }

        function stopInteraction(endEvent) {
          if (endEvent.pointerId !== pointerId) return;
          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', stopInteraction);
          document.removeEventListener('pointercancel', stopInteraction);
          if (pointerTarget.releasePointerCapture) {
            pointerTarget.releasePointerCapture(pointerId);
          }
          syncOutputNow();
        }

        document.addEventListener('pointermove', onPointerMove, { passive: false });
        document.addEventListener('pointerup', stopInteraction);
        document.addEventListener('pointercancel', stopInteraction);
      }

      // --- MOVE (drag the box body, not a handle) ---
      box.addEventListener('pointerdown', (event) => {
        if (event.target.classList.contains('resize-handle')) return;
        const containerRect = container.getBoundingClientRect();
        const boxRect = box.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        const startLeftPx = boxRect.left - containerRect.left;
        const startTopPx = boxRect.top - containerRect.top;
        const boxWidthPx = boxRect.width;
        const boxHeightPx = boxRect.height;
        startPointerInteraction(box, event, (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          const edgeSlack = container.clientWidth * 0.02;
          const newLeftPx = clamp(startLeftPx + dx, -edgeSlack, container.clientWidth - boxWidthPx + edgeSlack);
          const newTopPx = clamp(startTopPx + dy, -edgeSlack, container.clientHeight - boxHeightPx + edgeSlack);
          return {
            top: pct((newTopPx / container.clientHeight) * 100),
            left: pct((newLeftPx / container.clientWidth) * 100),
            width: cue.overlay.width,
            height: cue.overlay.height
          };
        });
      });

      // --- RESIZE (drag any corner handle) ---
      handles.forEach((handle) => {
        handle.addEventListener('pointerdown', (event) => {
          event.stopPropagation();

          const corner = handle.dataset.corner; // tl, tr, bl, br
          const containerRect = container.getBoundingClientRect();
          const boxRect = box.getBoundingClientRect();
          const startMouseX = event.clientX;
          const startMouseY = event.clientY;
          // Store starting geometry in px relative to container
          const startLeft = boxRect.left - containerRect.left;
          const startTop = boxRect.top - containerRect.top;
          const startWidth = boxRect.width;
          const startHeight = boxRect.height;
          const startRight = startLeft + startWidth;
          const startBottom = startTop + startHeight;
          const cW = container.clientWidth;
          const cH = container.clientHeight;
          const MIN = 1; // allow near hairline overlays for HP/mana bars
          startPointerInteraction(handle, event, (moveEvent) => {
            const dx = moveEvent.clientX - startMouseX;
            const dy = moveEvent.clientY - startMouseY;
            let newLeft = startLeft, newTop = startTop, newWidth = startWidth, newHeight = startHeight;

            const slack = cW * 0.02; // allow slight overflow past edges

            if (corner === 'tl') {
              newLeft = clamp(startLeft + dx, -slack, startRight - MIN);
              newTop = clamp(startTop + dy, -slack, startBottom - MIN);
              newWidth = startRight - newLeft;
              newHeight = startBottom - newTop;
            } else if (corner === 'tr') {
              newTop = clamp(startTop + dy, -slack, startBottom - MIN);
              newWidth = clamp(startWidth + dx, MIN, cW - startLeft + slack);
              newHeight = startBottom - newTop;
            } else if (corner === 'bl') {
              newLeft = clamp(startLeft + dx, -slack, startRight - MIN);
              newWidth = startRight - newLeft;
              newHeight = clamp(startHeight + dy, MIN, cH - startTop + slack);
            } else {
              newWidth = clamp(startWidth + dx, MIN, cW - startLeft + slack);
              newHeight = clamp(startHeight + dy, MIN, cH - startTop + slack);
            }

            return {
              top: pct((newTop / cH) * 100),
              left: pct((newLeft / cW) * 100),
              width: pct((newWidth / cW) * 100),
              height: pct((newHeight / cH) * 100)
            };
          });
        });
      });
    });
  }

  rerender();
}

function buildCueSearchTimeline(stimulus, options = {}) {
  const isTutorial = options.isTutorial === true || Boolean(stimulus.is_tutorial);
  const trialDurationSec = Number.isFinite(options.trialDurationSec)
    ? options.trialDurationSec
    : (isTutorial ? null : LIVE_TRIAL_DURATION_SEC);
  const revealedCueIds = [];
  const revealOrder = [];
  const revealConfidence = [];
  const contextViews = [];
  let trialStartTime = null;
  let trialDeadlineTime = null;
  let stimulusLocked = false;
  let timedOut = false;
  let timeoutSliderAdjustmentAvailable = false;
  let timeoutSliderLockedValue = null;
  let finalDecision = '';
  let finalDecisionConfidence = 0;
  let finalDecisionRationale = '';

  function recordContextView(phase) {
    if (trialStartTime === null) {
      trialStartTime = performance.now();
    }

    contextViews.push({
      phase,
      time: (performance.now() - trialStartTime) / 1000
    });
  }

  function getElapsedMs() {
    if (trialStartTime === null) return 0;
    return Math.max(0, performance.now() - trialStartTime);
  }

  function getElapsedSec() {
    return getElapsedMs() / 1000;
  }

  function getRemainingMs() {
    if (!trialDeadlineTime) return Infinity;
    return Math.max(0, trialDeadlineTime - performance.now());
  }

  function getCurrentConfidence() {
    return revealConfidence.length > 0 ? Number(revealConfidence[revealConfidence.length - 1]) : 0;
  }

  function getBaseStatusMessage() {
    if (timedOut) {
      return 'Time is up. The screenshot is blocked. Make your choice, then explain your answer.';
    }

    if (revealOrder.length === 0) {
      return isTutorial
        ? 'Practice round: click one of the labeled blocks to see how the study works. After each reveal, move the confidence slider before opening another block. You can commit to a final call at any time.'
        : 'Reveal blocks to gather information, update confidence after each reveal, and commit to Fight or Don\'t Fight whenever you are ready. The screenshot will be covered when the timer reaches zero.';
    }

    const lastReveal = revealOrder[revealOrder.length - 1];
    const revealSummary = formatRevealSummary(
      stimulus,
      lastReveal.revealed_cue_ids || [lastReveal.cue_id]
    );

    return isTutorial
      ? `Block revealed: ${revealSummary}. Update your confidence now before revealing another block. If you already know your answer, choose Fight or Don't Fight and continue.`
      : `Last block revealed: ${revealSummary}. Move the slider before revealing another block. You can still commit whenever you are ready.`;
  }

  function attachPriorContextToggle(phase, handlers = {}) {
    const toggle = document.querySelector('.prior-context-toggle');
    const panel = document.querySelector('.prior-context-panel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', function () {
      const isOpening = panel.hidden;
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(isOpening));
      toggle.classList.toggle('open', isOpening);

      if (isOpening) {
        recordContextView(phase);
        if (typeof handlers.onOpen === 'function') {
          handlers.onOpen();
        }
      } else if (typeof handlers.onClose === 'function') {
        handlers.onClose();
      }
    });
  }

  function createOverlayTrial() {
    return {
      type: jsPsychHtmlButtonResponse,
      choices: [],
      stimulus: function () {
        const remainingCues = stimulusLocked
          ? []
          : stimulus.cues.filter((cue) => !revealedCueIds.includes(cue.id));
        const currentConfidence = getCurrentConfidence();
        const statusMessage = getBaseStatusMessage();

        let html = `
          <div class="screen-wrap">
            <div class="trial-hero ${isTutorial ? 'tutorial-hero' : ''}">
              <div class="trial-hero-row">
                <div class="trial-hero-spacer" aria-hidden="true"></div>
                <h3>${escapeHtml(stimulus.role_prompt)}</h3>
                <div class="trial-chip ${trialDurationSec ? 'trial-chip-timer' : 'trial-chip-practice'}">
                  ${trialDurationSec
                    ? `Timer: <span id="trial-timer-value">${trialDurationSec}s</span>`
                    : 'Practice'}
                </div>
              </div>
            </div>

            <div class="stimulus-stage">
              <div class="screenshot-container ${stimulusLocked ? 'stimulus-locked' : ''}" id="participant-screenshot-container">
                <img src="${stimulus.screenshot}" alt="League screenshot" />
        `;

        remainingCues.forEach((cue) => {
          const overlay = getCueOverlay(cue);
          html += `
            <button
              class="cue-overlay reveal-box ${isTutorial ? 'tutorial-reveal-box' : ''}"
              data-cue-id="${cue.id}"
              style="
                top:${overlay.top};
                left:${overlay.left};
                width:${overlay.width};
                height:${overlay.height};
                cursor:pointer;
              "
              aria-label="${escapeHtml(cue.label ?? cue.id)}"
            >${isTutorial ? `<span class="cue-overlay-label tutorial-cue-label">${escapeHtml(cue.label ?? cue.id)}</span>` : ''}</button>
          `;
        });

        html += `
                <div id="stimulus-lock-cover" class="stimulus-lock-cover" ${stimulusLocked ? '' : 'hidden'}>
                  <div class="stimulus-lock-copy" id="stimulus-lock-copy">
                    ${timedOut
                      ? 'Time is up. Make your choice, then explain your answer.'
                      : ''}
                  </div>
                </div>
              </div>
              ${buildPriorContextMarkup(stimulus, `${stimulus.id}-overlay`, {
                buttonLabel: 'Prior context'
              })}
            </div>

            <div class="decision-panel">
              <div class="decision-panel-header">
                <label for="confidence-slider" class="decision-panel-title">Confidence</label>
              </div>

              <div class="slider-row decision-slider-row">
                <button
                  type="button"
                  id="decision-dont-fight"
                  class="decision-choice decision-choice-left"
                  data-decision="DON\'T FIGHT"
                >
                  <span class="decision-label">Don\'t Fight</span>
                </button>

                <input
                  id="confidence-slider"
                  type="range"
                  min="-100"
                  max="100"
                  value="${currentConfidence}"
                  style="flex:1; height:32px;"
                />

                <button
                  type="button"
                  id="decision-fight"
                  class="decision-choice decision-choice-right"
                  data-decision="FIGHT"
                >
                  <span class="decision-label">Fight</span>
                </button>
              </div>

              <div class="decision-scale-caption">
                Center = 0 (uncertain)
              </div>

              <p id="adjust-note" class="${revealedCueIds.length > 0 || timedOut ? 'warning-text' : 'hint'} status-banner">
                ${escapeHtml(statusMessage)}
              </p>

              <div id="rationale-section" class="rationale-section" hidden>
                <div class="rationale-heading">
                  Selected call: <strong id="selected-decision-label"></strong>
                </div>
                <label for="rationale">Rationale</label>
                <textarea
                  id="rationale"
                  rows="4"
                  cols="70"
                  placeholder="Briefly explain what led you to this call."
                ></textarea>
                <div class="rationale-actions">
                  <div id="rationale-word-count" class="text-muted">0 words</div>
                  <button id="submit-decision-btn" class="jspsych-btn">Continue to next stimulus</button>
                </div>
              </div>
            </div>
          </div>
        `;

        return html;
      },
      data: {
        stimulus_id: stimulus.id,
        phase: 'overlay',
        is_tutorial: isTutorial
      },
      on_load: function () {
        if (trialStartTime === null) {
          trialStartTime = performance.now();
          if (trialDurationSec) {
            trialDeadlineTime = trialStartTime + (trialDurationSec * 1000);
          }
        }

        const slider = document.getElementById('confidence-slider');
        const overlayButtons = document.querySelectorAll('.reveal-box');
        const decisionButtons = document.querySelectorAll('.decision-choice');
        const rationaleSection = document.getElementById('rationale-section');
        const rationaleInput = document.getElementById('rationale');
        const rationaleWordCount = document.getElementById('rationale-word-count');
        const submitDecisionBtn = document.getElementById('submit-decision-btn');
        const selectedDecisionLabel = document.getElementById('selected-decision-label');
        const adjustNote = document.getElementById('adjust-note');
        const lockCover = document.getElementById('stimulus-lock-cover');
        const lockCopy = document.getElementById('stimulus-lock-copy');
        const timerValue = document.getElementById('trial-timer-value');
        const priorContextToggle = document.querySelector('.prior-context-toggle');
        const priorContextPanel = document.querySelector('.prior-context-panel');
        let sliderTouched = revealedCueIds.length === 0;
        let requiredSliderValue = slider ? slider.value : null;
        let timerHandle = null;

        function clearTimer() {
          if (timerHandle !== null) {
            window.clearInterval(timerHandle);
            timerHandle = null;
          }
        }

        function updateStatusMessage(message, tone = 'warning') {
          if (!adjustNote) return;
          adjustNote.textContent = message;
          adjustNote.className = `${tone === 'hint' ? 'hint' : 'warning-text'} status-banner`;
        }

        function closePriorContext() {
          if (!priorContextToggle || !priorContextPanel) return;
          priorContextPanel.hidden = true;
          priorContextToggle.setAttribute('aria-expanded', 'false');
          priorContextToggle.classList.remove('open');
        }

        function lockStimulus(options = {}) {
          if (stimulusLocked) return;
          stimulusLocked = true;
          clearTimer();
          overlayButtons.forEach((button) => {
            button.disabled = true;
            button.classList.add('locked');
          });
          if (slider && options.freezeSlider) {
            slider.disabled = true;
          }
          if (lockCover) {
            lockCover.hidden = !options.showCover;
            lockCover.classList.toggle('timeout-cover', Boolean(options.isTimeout));
          }
          if (lockCopy && options.message) lockCopy.textContent = options.message;
          closePriorContext();
          if (priorContextToggle) {
            priorContextToggle.disabled = true;
            priorContextToggle.setAttribute('aria-disabled', 'true');
          }
        }

        function finishDecision() {
          const rationaleValue = rationaleInput ? rationaleInput.value.trim() : '';
          const rationaleWords = countWords(rationaleValue);
          const requiredRationaleWords = isTutorial ? 0 : MIN_RATIONALE_WORDS;

          if (!finalDecision) {
            alert('Choose Fight or Don\'t Fight before continuing.');
            return;
          }

          if (rationaleWords < requiredRationaleWords) {
            alert(`Please enter at least ${requiredRationaleWords} words in your rationale before continuing.`);
            return;
          }

          clearTimer();
          finalDecisionRationale = rationaleValue;
          finalDecisionConfidence = slider ? slider.value : finalDecisionConfidence;

          jsPsych.finishTrial({
            stimulus_id: stimulus.id,
            is_tutorial: isTutorial,
            event_type: 'decision',
            decision: finalDecision,
            decision_source: timedOut ? 'timeout' : 'self-paced',
            confidence: finalDecisionConfidence,
            last_confidence_before_timeout: timedOut ? timeoutSliderLockedValue ?? '' : '',
            final_confidence_post_timeout: timedOut ? finalDecisionConfidence : '',
            rationale: finalDecisionRationale,
            reveal_order: JSON.stringify(revealOrder),
            cues_revealed: JSON.stringify(revealedCueIds),
            reveal_confidence: JSON.stringify([...revealConfidence, finalDecisionConfidence]),
            num_cues_revealed: revealedCueIds.length,
            context_views: JSON.stringify(contextViews),
            num_context_views: contextViews.length,
            time: getElapsedSec(),
            rt: getElapsedMs(),
            timed_out: timedOut ? '1' : '0',
            trial_duration_sec: trialDurationSec ?? ''
          });
        }

        function updateTimerDisplay() {
          if (!timerValue || !trialDurationSec || stimulusLocked) return;

          const remainingMs = getRemainingMs();
          const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
          timerValue.textContent = `${remainingSec}s`;
          timerValue.classList.toggle('urgent', remainingSec <= 10);

          if (remainingMs <= 0) {
            timedOut = true;
            timeoutSliderAdjustmentAvailable = true;
            timeoutSliderLockedValue = slider ? slider.value : null;
            lockStimulus({
              showCover: true,
              isTimeout: true,
              message: 'Time is up. Make your choice, then explain your answer.'
            });
            updateStatusMessage(
              'Time is up. The screenshot is blocked. You may make one last confidence change, then choose Fight or Don\'t Fight and explain your answer.',
              'warning'
            );
          }
        }

        attachPriorContextToggle('overlay', {
          onOpen: function () {
            if (!stimulusLocked && slider) {
              sliderTouched = false;
              requiredSliderValue = slider.value;
              updateStatusMessage(
                'You opened prior context. Move the slider again before revealing another block. You can still make your final choice at any time.',
                'warning'
              );
            }
          }
        });

        if (slider) {
          slider.addEventListener('input', () => {
            if (timedOut && timeoutSliderAdjustmentAvailable && slider.value !== timeoutSliderLockedValue) {
              timeoutSliderAdjustmentAvailable = false;
              slider.disabled = true;
              finalDecisionConfidence = slider.value;
              updateStatusMessage(
                'Final confidence update saved. Choose Fight or Don\'t Fight, then enter your rationale.',
                'hint'
              );
              return;
            }

            if (!sliderTouched && slider.value !== requiredSliderValue) {
              sliderTouched = true;
              updateStatusMessage(
                stimulusLocked
                  ? 'Confidence updated. Finish your rationale whenever you are ready.'
                  : 'Confidence updated. You can reveal another block or commit to a final call.',
                'hint'
              );
            }
          });
        }

        if (rationaleInput && rationaleWordCount) {
          rationaleInput.addEventListener('input', function () {
            rationaleWordCount.textContent = `${countWords(rationaleInput.value)} words`;
          });
        }

        overlayButtons.forEach((button) => {
          button.addEventListener('click', function () {
            if (stimulusLocked) return;
            if (!sliderTouched) {
              alert('Move the confidence slider before continuing.');
              return;
            }

            const cueId = this.dataset.cueId;
            const revealedCueIdsForClick = cuesTriggeredByClick(stimulus, cueId);

            clearTimer();
            jsPsych.finishTrial({
              stimulus_id: stimulus.id,
              is_tutorial: isTutorial,
              event_type: 'reveal',
              cue_id: cueId,
              reveal_group: cueRevealGroup(stimulus.cues.find((cue) => cue.id === cueId)),
              revealed_cue_ids: revealedCueIdsForClick,
              confidence: slider ? slider.value : null,
              time: getElapsedSec()
            });
          });
        });

        decisionButtons.forEach((button) => {
          button.addEventListener('click', function () {
            finalDecision = button.dataset.decision || '';
            finalDecisionConfidence = slider ? slider.value : finalDecisionConfidence;

            decisionButtons.forEach((choiceButton) => {
              choiceButton.classList.toggle('selected', choiceButton === button);
            });

            lockStimulus({
              showCover: timedOut,
              isTimeout: timedOut,
              message: timedOut
                ? 'Time is up. Your choice is selected. Finish your explanation to continue.'
                : ''
            });

            if (selectedDecisionLabel) selectedDecisionLabel.textContent = finalDecision;
            if (rationaleSection) rationaleSection.hidden = false;
            if (rationaleInput) rationaleInput.focus();

            updateStatusMessage(
              timedOut
                ? `${finalDecision} selected after timeout. Add your rationale to continue.`
                : `${finalDecision} selected. Add your rationale and continue to the next stimulus when ready.`,
              timedOut ? 'warning' : 'hint'
            );
          });
        });

        if (submitDecisionBtn) {
          submitDecisionBtn.addEventListener('click', finishDecision);
        }

        updateTimerDisplay();
        if (trialDurationSec) {
          timerHandle = window.setInterval(updateTimerDisplay, 250);
        }
      }
    };
  }

  const overlayLoop = {
    timeline: [createOverlayTrial()],
    loop_function: function (data) {
      const last = data.values()[data.values().length - 1];

      if (last.event_type === 'reveal') {
        uniquePushAll(revealedCueIds, last.revealed_cue_ids || [last.cue_id]);
        revealOrder.push({
          cue_id: last.cue_id,
          reveal_group: last.reveal_group || null,
          revealed_cue_ids: last.revealed_cue_ids || [last.cue_id],
          time: last.time
        });
        revealConfidence.push(last.confidence);
        return true;
      }

      return false;
    }
  };

  return [overlayLoop];
}

const confidenceInstructionsTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Continue'],
  stimulus:
    '<div class="screen-wrap"><h2>Confidence Slider Instructions</h2>' +
    '<p>The slider measures both direction and certainty as you reveal more information.</p>' +
    '<p><strong>-100</strong> means you are completely certain the correct call is <strong>Don\'t Fight</strong>.</p>' +
    '<p><strong>0</strong> means you are uncertain.</p>' +
    '<p><strong>100</strong> means you are completely certain the correct call is <strong>Fight</strong>.</p>' +
    '<p>After every reveal, move the slider before opening another block. You can still commit to Fight or Don\'t Fight at any time.</p></div>'
};

const priorContextInstructionsTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Continue'],
  stimulus:
    '<div class="screen-wrap"><h2>Prior Context Instructions</h2>' +
    '<p><strong>Prior Context</strong> is the fixed question-mark overlay in the top-right corner of every trial.</p>' +
    '<p>It contains off-screen or recently elapsed information a player might still be using, even though it is not fully visible in the screenshot itself.</p>' +
    '<p><em>Examples:</em> "Enemy Kha\'Zix was last seen bot-side 12 seconds ago." "Alistar used Flash in the previous trade." "Ornn just spent key cooldowns before the screenshot was taken."</p>' +
    '<p>You do not have to open prior context. If you do open it, move the confidence slider again before revealing another block. You can still commit to Fight or Don\'t Fight whenever you are ready.</p></div>'
};

const landingTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Continue'],
  stimulus:
    '<div class="screen-wrap"><h1>Welcome to the League Decision Task</h1>' +
    '<p>In this study, you will look at League of Legends screenshots and make quick callouts about whether your team should <strong>Fight</strong> or <strong>Don\'t Fight</strong>.</p>' +
    '<p>You can reveal hidden blocks to gather more information, update your confidence as you go, and then give a short explanation for your final choice.</p>' +
    '<p>Most rounds are timed, so the goal is not to find everything. The goal is to make the best call you can with limited time and limited information.</p>' +
    '<p>You will first complete a short survey and a practice round before the live trials begin.</p></div>'
};

const surveyTrial = {
  type: jsPsychSurveyText,
  preamble: '<div class="screen-wrap"><h2>Pre-experiment Survey</h2><p>Please answer the following questions before beginning the task.</p></div>',
  questions: [
    { prompt: 'What is the highest League of Legends rank you have achieved?', name: 'rank', placeholder: 'e.g., Gold IV', required: true },
    { prompt: 'What is your current rank in League of Legends?', name: 'current_rank', placeholder: 'e.g., Platinum II', required: true },
    { prompt: 'OP.GG Link (optional)', name: 'opgg', placeholder: 'https://www.op.gg/summoner/userName=yourname' },
    { prompt: 'On average, how many hours per week do you play League of Legends?', name: 'hours', placeholder: 'e.g., 10', required: true },
    { prompt: 'Briefly describe your preferred playstyle.', name: 'playstyle', rows: 3, columns: 50, placeholder: 'Type your answer here...' },
    { prompt: 'What is your primary role in League of Legends?', name: 'role', placeholder: 'e.g., Mid, Jungle, Support', required: true },
    { prompt: 'Are you an OTP (one-trick pony) for a specific champion? If so, who?', name: 'otp', placeholder: 'e.g., Yes, I main Yasuo' },
    { prompt: 'Do you have experience playing amateur (or higher) competitive League of Legends?', name: 'competitive', placeholder: 'e.g., Yes, I played on a team for Titan eSports' }
  ],
  button_label: 'Continue'
};

const experimentInstructionsTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Continue'],
  stimulus:
    '<div class="screen-wrap"><h2>Experiment Instructions</h2>' +
    '<p>Each trial shows a League of Legends screenshot with several hidden <strong>blocks</strong>.</p>' +
    '<p>You may reveal blocks one at a time to gather information. After each reveal, update the confidence slider before opening another block.</p>' +
    '<p>The two large endpoint buttons double as your final decision buttons: choose <strong>Fight</strong> or <strong>Don\'t Fight</strong> whenever you are ready, then type a short rationale.</p>' +
    '<p>Live trials are timed. Once the countdown reaches zero, the screenshot is fully blocked and you must make your call using only the information you already gathered.</p></div>'
};

const tutorialIntroTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Start tutorial'],
  stimulus:
    '<div class="screen-wrap"><h2>Tutorial Round</h2>' +
    '<p>This practice trial is not scored. It exists to teach the flow before the timed study begins.</p>' +
    '<p>You will reveal a few example blocks, see how confidence updates work, and finish with the same Fight / Don\'t Fight decision flow used in the live trials.</p>' +
    '<p>The on-screen coaching text will tell you exactly what happened after each reveal and what you can do next.</p></div>'
};

const liveStudyStartTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Begin live trials'],
  stimulus:
    '<div class="screen-wrap"><h2>Live Trials</h2>' +
    '<p>The practice round is complete. The scored trials now use the timed fast-decision format.</p>' +
    `<p>Each live screenshot gives you up to <strong>${LIVE_TRIAL_DURATION_SEC} seconds</strong> to reveal only the blocks you think you need.</p>` +
    '<p>When the timer expires, the screenshot is fully covered and you must make a Fight / Don\'t Fight decision and provide a brief rationale.</p></div>'
};

const completionTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Finish and save'],
  stimulus:
    '<div class="screen-wrap">' +
    '<h2>Done</h2>' +
    '<p>You have completed the study.</p>' +
    '<p>Click the button below to save your responses and finish.</p>' +
    '</div>',
  on_finish: function () {
    const resultTable = buildSpreadsheetResult();

    if (typeof jatos !== 'undefined') {
      jatos.endStudy(resultTable);
    } else {
      downloadTextFile('league-study-results.tsv', resultTable);
    }
  }
};

function runParticipantExperiment() {
  const timeline = [];
  timeline.push(landingTrial);
  timeline.push(experimentInstructionsTrial);
  timeline.push(surveyTrial);
  timeline.push(confidenceInstructionsTrial);
  timeline.push(priorContextInstructionsTrial);
  timeline.push(tutorialIntroTrial);
  timeline.push(buildTrialPreview(tutorialStimulus, { isTutorial: true }));
  timeline.push(...buildCueSearchTimeline(tutorialStimulus, { isTutorial: true }));
  timeline.push(liveStudyStartTrial);

  stimuli.forEach((stimulus) => {
    timeline.push(buildTrialPreview(stimulus));
    timeline.push(...buildCueSearchTimeline(stimulus));
  });

  timeline.push(completionTrial);

  if (typeof jatos !== 'undefined') {
    jatos.onLoad(() => {
      jsPsych.run(timeline);
    });
  } else {
    jsPsych.run(timeline);
  }
}

if (EDIT_MODE) {
  renderCalibrationApp();
} else {
  runParticipantExperiment();
}
