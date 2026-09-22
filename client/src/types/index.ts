export interface StepData {
  stepIndex?: number;
  name?: string;
  subtext?: string;
  label?: string;
  action?: string;
  selector?: string;
  value?: string;
  expected?: string;
  components?: number;
  metricTime?: string;
  metricPassed?: number;
  metricAutomated?: number;
  metricFailed?: number;
  isAutomated?: boolean;
  status: 'idle' | 'running' | 'passed' | 'failed' | 'skipped';
  previewType?: 'search' | 'pdp' | 'cart' | 'checkout' | 'payment' | 'confirmation';
  screenshot?: string;
  duration?: string;
  isStart?: boolean;
  isEnd?: boolean;
  condition?: string;
  [key: string]: any;
}

export interface ScenarioNode {
  id: string;
  type: 'flowStepNode' | 'terminatorNode' | 'decisionNode';
  position: { x: number; y: number };
  data: StepData;
}

export interface ScenarioEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface Scenario {
  id: string;
  projectId?: string;
  title: string;
  category: string;
  categories?: string[];
  description: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  componentsCount: number;
  lastRunDuration: string;
  status: 'passed' | 'failed' | 'running' | 'idle';
  targetUrl: string;
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
}

export interface WorkflowProgress {
  title: string;
  tasks: number;
  executed: number;
  done: number;
}

export interface FlowObjectiveItem {
  id: string;
  title: string;
  subtitle: string;
  pills: {
    task: number;
    time: string;
    passed: number;
    automated: number;
  };
}

export interface RealMetricsData {
  realTime: boolean;
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  passRate: number;
  automationCoveragePercent: number;
  workflowA: WorkflowProgress;
  workflowB: WorkflowProgress;
  flowObjectives: FlowObjectiveItem[];
  recentActivities: {
    id: string;
    time: string;
    duration: string;
    status: 'passed' | 'failed';
    author: string;
    target: string;
    errors: number;
    stepsPassed: number;
    stepsTotal: number;
  }[];
}
