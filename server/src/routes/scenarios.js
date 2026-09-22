const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../../data/scenarios.json');

function getScenarios() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading scenarios:', err);
    return [];
  }
}

function saveScenarios(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving scenarios:', err);
    return false;
  }
}

// GET all scenarios
router.get('/', (req, res) => {
  const scenarios = getScenarios();
  res.json(scenarios);
});

// GET single scenario
router.get('/:id', (req, res) => {
  const scenarios = getScenarios();
  const scenario = scenarios.find(s => s.id === req.params.id);
  if (!scenario) {
    return res.status(404).json({ error: 'Scenario not found' });
  }
  res.json(scenario);
});

// POST create new scenario
router.post('/', (req, res) => {
  const scenarios = getScenarios();
  const newScenario = {
    id: 'scenario-' + uuidv4().slice(0, 8),
    title: req.body.title || 'New Custom Test Scenario',
    category: req.body.category || 'Custom Scenarios',
    categories: req.body.categories || (req.body.category ? [req.body.category] : ['Custom Scenarios']),
    projectId: req.body.projectId || 'proj-flowshop-tr',
    description: req.body.description || 'User-defined automated e-commerce test flow.',
    criticality: req.body.criticality || 'Medium',
    componentsCount: req.body.componentsCount || 5,
    lastRunDuration: 'Not executed yet',
    status: 'idle',
    targetUrl: req.body.targetUrl || 'http://localhost:5000/demo-shop',
    nodes: req.body.nodes || [
      {
        id: 'node-start',
        type: 'terminatorNode',
        position: { x: 380, y: 40 },
        data: { label: 'Start Session', subtext: 'Init Browser', status: 'idle', isStart: true }
      },
      {
        id: 'node-step-1',
        type: 'flowStepNode',
        position: { x: 280, y: 160 },
        data: {
          stepIndex: 1,
          name: 'Open Store & Browse',
          action: 'navigate',
          selector: 'body',
          expected: 'Storefront loaded',
          components: 4,
          isAutomated: true,
          status: 'idle',
          previewType: 'search',
          screenshot: ''
        }
      },
      {
        id: 'node-end',
        type: 'terminatorNode',
        position: { x: 380, y: 340 },
        data: { label: 'Close Browser', subtext: 'End Flow', status: 'idle', isEnd: true }
      }
    ],
    edges: req.body.edges || [
      { id: 'e1', source: 'node-start', target: 'node-step-1', animated: true },
      { id: 'e2', source: 'node-step-1', target: 'node-end', animated: true }
    ]
  };

  scenarios.push(newScenario);
  saveScenarios(scenarios);
  res.status(201).json(newScenario);
});

// PUT update scenario
router.put('/:id', (req, res) => {
  const scenarios = getScenarios();
  const index = scenarios.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Scenario not found' });
  }

  scenarios[index] = {
    ...scenarios[index],
    ...req.body,
    id: req.params.id // prevent ID overwrite
  };

  saveScenarios(scenarios);
  res.json(scenarios[index]);
});

// DELETE scenario
router.delete('/:id', (req, res) => {
  let scenarios = getScenarios();
  const initialLength = scenarios.length;
  scenarios = scenarios.filter(s => s.id !== req.params.id);
  
  if (scenarios.length === initialLength) {
    return res.status(404).json({ error: 'Scenario not found' });
  }

  saveScenarios(scenarios);
  res.json({ message: 'Scenario deleted successfully', id: req.params.id });
});

module.exports = router;
