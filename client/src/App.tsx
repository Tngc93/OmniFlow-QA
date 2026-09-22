import React, { useState, useEffect, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection, Node, Edge } from '@xyflow/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FlowCanvas } from './components/FlowCanvas';
import { RightSidebar } from './components/RightSidebar';
import { NewScenarioModal } from './components/NewScenarioModal';
import { ScreenshotModal } from './components/ScreenshotModal';
import { DemoStoreModal } from './components/DemoStoreModal';
import { TrainingGuideModal } from './components/TrainingGuideModal';
import { NewProjectFolderModal } from './components/NewProjectFolderModal';
import { WebVitalsModal } from './components/WebVitalsModal';
import { VisualRegressionModal } from './components/VisualRegressionModal';
import { PlaywrightCodeModal } from './components/PlaywrightCodeModal';
import { SelfHealingModal } from './components/SelfHealingModal';

import { ScenariosView } from './views/ScenariosView';
import { ComplianceView } from './views/ComplianceView';
import { SchedulerView } from './views/SchedulerView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { IntegrationsView, RepositoryView } from './views/MiscViews';

import { Scenario, ScenarioNode, RealMetricsData } from './types';
import { fetchScenarios, fetchMetrics, runScenario, createScenario, API_BASE } from './services/api';
import { wsService } from './services/websocket';
import { Language } from './locales/translations';
import { CanvasTabBar } from './components/CanvasTabBar';
import { MASTER_PIPELINE_SCENARIO, getMasterPipeline, MASTER_DOMAINS } from './data/masterPipeline';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('master-pipeline');
  const [metrics, setMetrics] = useState<RealMetricsData | null>(null);

  // Canvas Tabs State (Master Pipeline + Open Scenario Tabs)
  const [openScenarioTabIds, setOpenScenarioTabIds] = useState<string[]>([
    'scenario-novatech-tr-e2e',
    'scenario-novatech-de-e2e',
    'scenario-novatech-de-configurator'
  ]);
  const [activeCanvasTabId, setActiveCanvasTabId] = useState<string>('master-pipeline');
  const [selectedMasterDomain, setSelectedMasterDomain] = useState<'novatech-tr' | 'novatech-de' | 'all'>('novatech-tr');

  // Projects / Site Folders State
  const [projects, setProjects] = useState<any[]>([
    {
      id: 'proj-novatech-tr',
      name: 'NovaTech Türkiye Resmi Mağazası',
      baseUrl: 'https://www.novatech.com.tr',
      scenariosCount: 20
    },
    {
      id: 'proj-novatech-de',
      name: 'NovaTech Deutschland (Europe)',
      baseUrl: 'https://www.novatech.de',
      scenariosCount: 18
    }
  ]);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-novatech-tr');

  // Language & Dark Mode Theme State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('omniflow_lang') as Language) || 'tr';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('omniflow_theme') === 'dark';
  });

  // Sync dark class on <html> document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omniflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omniflow_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync language in localStorage
  useEffect(() => {
    localStorage.setItem('omniflow_lang', lang);
  }, [lang]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleLang = () => setLang(prev => (prev === 'tr' ? 'en' : 'tr'));

  // Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [, setSelectedNode] = useState<ScenarioNode | null>(null);

  // UI Panels
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Execution & Logs
  const [isRunning, setIsRunning] = useState(false);

  // Modals
  const [isNewScenarioModalOpen, setIsNewScenarioModalOpen] = useState(false);
  const [isNewProjectFolderModalOpen, setIsNewProjectFolderModalOpen] = useState(false);
  const [isTrainingGuideModalOpen, setIsTrainingGuideModalOpen] = useState(false);
  const [isLiveSiteModalOpen, setIsLiveSiteModalOpen] = useState(false);
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  // Device Viewport Emulation & New Feature Modals
  const [activeViewport, setActiveViewport] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [isWebVitalsOpen, setIsWebVitalsOpen] = useState(false);
  const [isVisualDiffOpen, setIsVisualDiffOpen] = useState(false);
  const [visualDiffData, setVisualDiffData] = useState<{ stepName?: string; screenshot?: string }>({});

  // Playwright Code & Self-Healing Modals
  const [isPlaywrightCodeModalOpen, setIsPlaywrightCodeModalOpen] = useState(false);
  const [isSelfHealingModalOpen, setIsSelfHealingModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenVisualDiff = (e: any) => {
      setVisualDiffData(e.detail || {});
      setIsVisualDiffOpen(true);
    };
    const handleOpenPlaywrightCode = () => setIsPlaywrightCodeModalOpen(true);
    const handleOpenSelfHealing = () => setIsSelfHealingModalOpen(true);

    window.addEventListener('open-visual-diff', handleOpenVisualDiff);
    window.addEventListener('open-playwright-code', handleOpenPlaywrightCode);
    window.addEventListener('open-self-healing', handleOpenSelfHealing);

    return () => {
      window.removeEventListener('open-visual-diff', handleOpenVisualDiff);
      window.removeEventListener('open-playwright-code', handleOpenPlaywrightCode);
      window.removeEventListener('open-self-healing', handleOpenSelfHealing);
    };
  }, []);

  // Load projects, scenarios and real metrics on mount
  useEffect(() => {
    async function initData() {
      try {
        const [scList, mData, projList] = await Promise.all([
          fetchScenarios(), 
          fetchMetrics(),
          fetch(`${API_BASE}/projects`).then(r => r.json()).catch(() => [])
        ]);

        if (Array.isArray(projList) && projList.length > 0) {
          setProjects(projList);
        }

        setScenarios(scList);
        setMetrics(mData);

        // Initialize with Master Pipeline by default on Kontrol Paneli
        setActiveScenarioId('master-pipeline');
        setActiveCanvasTabId('master-pipeline');
        const initialMaster = getMasterPipeline('novatech-tr');
        setNodes(initialMaster.nodes as Node[]);
        setEdges(initialMaster.edges as Edge[]);
      } catch (err) {
        console.error('Init error', err);
      }
    }
    initData();
  }, [setNodes, setEdges]);

  // Connect WebSocket for real-time telemetry
  useEffect(() => {
    wsService.connect();

    const unsubRunStart = wsService.on('RUN_START', (data) => {
      console.log('[Telemetry] RUN_START', data);
      setIsRunning(true);

      // Reset node statuses to idle
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            status: 'idle',
            duration: undefined
          }
        }))
      );
    });

    const unsubStepStart = wsService.on('STEP_START', (data) => {
      console.log('[Telemetry] STEP_START', data);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === data.nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                status: 'running'
              }
            };
          }
          return node;
        })
      );
    });

    const unsubStepComplete = wsService.on('STEP_COMPLETE', (data) => {
      console.log('[Telemetry] STEP_COMPLETE', data);
      const res = data.stepResult;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === data.nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                status: res.status,
                duration: res.duration,
                screenshot: res.screenshotUrl || (node.data as any).screenshot
              }
            };
          }
          return node;
        })
      );
    });

    const unsubRunComplete = wsService.on('RUN_COMPLETE', (data) => {
      console.log('[Telemetry] RUN_COMPLETE', data);
      setIsRunning(false);

      // Refresh real metrics from backend runs.json
      fetchMetrics().then(m => {
        if (m) setMetrics(m);
      });

      // Update scenario in state
      setScenarios((prev) =>
        prev.map((s) =>
          s.id === data.scenarioId
            ? { ...s, status: data.status, lastRunDuration: data.totalDuration }
            : s
        )
      );
    });

    return () => {
      unsubRunStart();
      unsubStepStart();
      unsubStepComplete();
      unsubRunComplete();
    };
  }, [setNodes]);

  // Listen for open-screenshot-modal custom event from FlowStepNode
  useEffect(() => {
    const handleOpenScreenshot = (e: any) => {
      if (e.detail?.url) {
        setPreviewScreenshotUrl(e.detail.url);
      }
    };
    window.addEventListener('open-screenshot-modal', handleOpenScreenshot);
    return () => window.removeEventListener('open-screenshot-modal', handleOpenScreenshot);
  }, []);

  // Canvas Tab Selection Handler
  const handleSelectCanvasTab = useCallback((tabId: string) => {
    setActiveCanvasTabId(tabId);
    if (tabId === 'master-pipeline') {
      setActiveScenarioId('master-pipeline');
      const masterScenario = getMasterPipeline(selectedMasterDomain);
      setNodes(masterScenario.nodes as Node[]);
      setEdges(masterScenario.edges as Edge[]);
    } else {
      setActiveScenarioId(tabId);
      const target = scenarios.find((s) => s.id === tabId);
      if (target) {
        setNodes(target.nodes as Node[]);
        setEdges(target.edges as Edge[]);
      }
    }
  }, [scenarios, selectedMasterDomain, setNodes, setEdges]);

  // Master Pipeline Domain Switcher Handler
  const handleSelectMasterDomain = (domainId: 'novatech-tr' | 'novatech-de' | 'all') => {
    setSelectedMasterDomain(domainId);
    const masterScenario = getMasterPipeline(domainId);
    if (activeCanvasTabId === 'master-pipeline') {
      setNodes(masterScenario.nodes as Node[]);
      setEdges(masterScenario.edges as Edge[]);
    }
    if (domainId === 'novatech-de' || (domainId as any) === 'tulpar-de') {
      setActiveProjectId('proj-novatech-de');
    } else if (domainId === 'novatech-tr' || (domainId as any) === 'monster-tr') {
      setActiveProjectId('proj-novatech-tr');
    }
  };

  // Close Tab
  const handleCloseCanvasTab = (tabId: string) => {
    setOpenScenarioTabIds(prev => prev.filter(id => id !== tabId));
    if (activeCanvasTabId === tabId) {
      handleSelectCanvasTab('master-pipeline');
    }
  };

  // Open Scenario in a new tab
  const handleOpenScenarioInTab = (scenarioId: string) => {
    if (!openScenarioTabIds.includes(scenarioId)) {
      setOpenScenarioTabIds(prev => [...prev, scenarioId]);
    }
    handleSelectCanvasTab(scenarioId);
  };

  // Handle Scenario Selection from Header dropdown
  const handleSelectScenario = useCallback((id: string) => {
    handleOpenScenarioInTab(id);
  }, [openScenarioTabIds, handleSelectCanvasTab]);

  // Select and Load scenario into canvas from Scenario catalog view
  const handleSelectAndLoadToCanvas = (id: string) => {
    handleOpenScenarioInTab(id);
    setActiveTab('Dashboard');
  };

  // Run scenario directly from catalog view
  const handleRunScenarioDirectly = async (id: string) => {
    handleOpenScenarioInTab(id);
    setActiveTab('Dashboard');
    setIsRunning(true);
    await runScenario(id);
  };

  // Handle Run Test on active scenario or Master Pipeline
  const handleRunTest = async (specificScenarioId?: string) => {
    if (isRunning) return;
    const targetId = specificScenarioId || activeScenarioId;
    setIsRunning(true);

    if (targetId === 'master-pipeline') {
      const currentMaster = getMasterPipeline(selectedMasterDomain);
      // Step through all nodes of Master Pipeline
      setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })));
      for (let i = 0; i < currentMaster.nodes.length; i++) {
        const nodeId = currentMaster.nodes[i].id;
        setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, status: 'running' } } : n));
        await new Promise(r => setTimeout(r, 450));
        setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, status: 'passed' } } : n));
      }
      setIsRunning(false);
      return;
    }

    await runScenario(targetId, { viewport: activeViewport });
  };

  // Reset and Restart Automation from Step 1
  const handleRestartTest = async () => {
    if (isRunning) return;
    if (activeScenarioId === 'master-pipeline') {
      const currentMaster = getMasterPipeline(selectedMasterDomain);
      setNodes(currentMaster.nodes as Node[]);
      await handleRunTest('master-pipeline');
      return;
    }
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle',
          duration: undefined
        }
      }))
    );
    await handleRunTest(activeScenarioId);
  };

  // Manual Edge Connection on Canvas
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'pillLabelEdge',
            animated: true,
            label: lang === 'tr' ? 'Bağlantılı Akış' : 'Linked Flow',
            markerEnd: 'url(#flow-arrow)'
          },
          eds
        )
      );
    },
    [setEdges, lang]
  );

  // Handle Node Click in Canvas
  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as unknown as ScenarioNode);
  };

  // Handle Create New Custom Scenario
  const handleCreateScenario = async (data: Partial<Scenario>) => {
    const created = await createScenario({
      ...data,
      projectId: activeProjectId
    });
    if (created) {
      setScenarios((prev) => [...prev, created]);
      handleSelectScenario(created.id);
      setActiveTab('Dashboard');
    }
  };

  // Handle Project Folder Created with auto-scanned routes
  const handleProjectCreated = (newProject: any) => {
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    // Reload scenarios to pick up auto-generated scenarios for this project
    fetchScenarios().then(list => {
      setScenarios(list);
      const projSc = list.find(s => s.projectId === newProject.id);
      if (projSc) {
        handleSelectScenario(projSc.id);
      }
    });
  };

  // Handle Project Folder Updated
  const handleUpdateProject = (updatedProject: any) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p))
    );
  };

  // Add Flow Objective directly to current Canvas
  const handleAddObjectiveToCanvas = (obj: any) => {
    const maxY = nodes.length > 0 ? Math.max(...nodes.map((n) => n.position.y)) : 0;
    const nextY = maxY > 0 ? maxY + 250 : 180;
    const newNodeId = `node-step-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'flowStepNode',
      position: { x: 380, y: nextY },
      data: {
        stepIndex: nodes.length + 1,
        name: obj.title,
        subtext: obj.subtitle,
        action: 'custom_step',
        components: obj.pills?.task || 12,
        metricTime: obj.pills?.time || '1.5s',
        metricPassed: obj.pills?.passed || 20,
        metricAutomated: obj.pills?.automated || 35,
        isAutomated: true,
        status: 'idle',
        previewType: 'pdp'
      }
    };

    setNodes((nds) => [...nds, newNode]);

    if (nodes.length > 0) {
      const sortedByY = [...nodes].sort((a, b) => b.position.y - a.position.y);
      const prevNode = sortedByY[0];
      const newEdge: Edge = {
        id: `e-${prevNode.id}-${newNodeId}`,
        source: prevNode.id,
        target: newNodeId,
        label: 'Direct Processing',
        animated: true
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  };

  const activeScenario = activeCanvasTabId === 'master-pipeline'
    ? getMasterPipeline(selectedMasterDomain)
    : (scenarios.find((s) => s.id === activeScenarioId) || getMasterPipeline(selectedMasterDomain));
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const currentMasterDomain = MASTER_DOMAINS.find(d => d.id === selectedMasterDomain) || MASTER_DOMAINS[0];
  const isMasterTab = activeCanvasTabId === 'master-pipeline';

  // Render main content area depending on active left sidebar tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'Scenarios':
      case 'Workflows':
        return (
          <ScenariosView
            scenarios={scenarios}
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onOpenNewProjectModal={() => setIsNewProjectFolderModalOpen(true)}
            onSelectAndLoadScenario={handleSelectAndLoadToCanvas}
            onRunScenarioDirectly={handleRunScenarioDirectly}
            onOpenNewModal={() => setIsNewScenarioModalOpen(true)}
            onOpenTrainingGuide={() => setIsTrainingGuideModalOpen(true)}
            onUpdateProject={handleUpdateProject}
            lang={lang}
          />
        );
      case 'Compliance':
        return <ComplianceView lang={lang} />;
      case 'Scheduler':
        return (
          <SchedulerView 
            lang={lang} 
            scenarios={scenarios}
            onTriggerScenario={(scId) => handleRunTest(scId)}
          />
        );
      case 'Analytics':
        return <AnalyticsView lang={lang} />;
      case 'Integrations':
        return <IntegrationsView lang={lang} />;
      case 'Repository':
        return <RepositoryView lang={lang} />;
      case 'Settings':
        return (
          <SettingsView
            lang={lang}
            onSetLang={setLang}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
          />
        );
      case 'Dashboard':
      default:
        return (
          <div className="flex-1 flex h-full min-w-0 overflow-hidden relative">
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
              {/* Canvas Top Tab Bar: Master Pipeline + Open Scenario Tabs */}
              <CanvasTabBar
                activeTabId={activeCanvasTabId}
                onSelectTab={handleSelectCanvasTab}
                openScenarioIds={openScenarioTabIds}
                onCloseTab={handleCloseCanvasTab}
                onOpenScenarioInTab={handleOpenScenarioInTab}
                scenarios={scenarios}
                lang={lang}
                selectedMasterDomain={selectedMasterDomain}
                onSelectMasterDomain={handleSelectMasterDomain}
              />

              <div className="flex-1 relative overflow-hidden">
                <FlowCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={handleNodeClick}
                  onConnect={onConnect}
                  onRestartTest={handleRestartTest}
                  isDarkMode={isDarkMode}
                  activeScenarioTitle={activeScenario?.title}
                  targetUrl={activeScenario?.targetUrl || activeProject?.baseUrl}
                  domainFlag={isMasterTab ? currentMasterDomain.flag : (activeProject?.baseUrl?.includes('.de') ? '🇩🇪' : '🇹🇷')}
                  domainBadge={isMasterTab ? currentMasterDomain.domain : (activeProject?.baseUrl?.includes('.de') ? 'novatech.de' : 'novatech.com.tr')}
                  onOpenTrainingGuide={() => setIsTrainingGuideModalOpen(true)}
                  lang={lang}
                  viewport={activeViewport}
                  onViewportChange={setActiveViewport}
                  onOpenWebVitals={() => setIsWebVitalsOpen(true)}
                  onOpenPlaywrightCode={() => setIsPlaywrightCodeModalOpen(true)}
                  onOpenSelfHealing={() => setIsSelfHealingModalOpen(true)}
                />
              </div>
            </main>

            {/* Right Sidebar (Performance & Flow Objectives) */}
            <RightSidebar
              metrics={metrics}
              activeScenario={activeScenario}
              isOpen={isRightSidebarOpen}
              onClose={() => setIsRightSidebarOpen(false)}
              onAddObjectiveToCanvas={handleAddObjectiveToCanvas}
              onOpenScreenshotModal={(url) => setPreviewScreenshotUrl(url)}
              lang={lang}
            />
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden select-none ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* 1. Left Sidebar: OmniFlow QA */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        lang={lang}
        scenariosCount={scenarios.length}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <Header
          scenarios={scenarios}
          activeScenario={activeScenario}
          onSelectScenario={handleSelectScenario}
          onOpenNewScenarioModal={() => setIsNewScenarioModalOpen(true)}
          isRunning={isRunning}
          onRunTest={() => handleRunTest()}
          onRestartTest={handleRestartTest}
          isRightSidebarOpen={isRightSidebarOpen}
          onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          onOpenLiveSite={() => setIsLiveSiteModalOpen(true)}
          lang={lang}
          onToggleLang={toggleLang}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenTrainingGuide={() => setIsTrainingGuideModalOpen(true)}
          activeProject={activeProject}
        />

        {/* Dynamic View based on Left Menu selection */}
        <div className="flex-1 overflow-hidden relative flex">
          {renderMainContent()}
        </div>
      </div>

      {/* Modals */}
      <NewScenarioModal
        isOpen={isNewScenarioModalOpen}
        onClose={() => setIsNewScenarioModalOpen(false)}
        onCreate={handleCreateScenario}
        lang={lang}
        defaultTargetUrl={activeProject?.baseUrl}
      />

      <NewProjectFolderModal
        isOpen={isNewProjectFolderModalOpen}
        onClose={() => setIsNewProjectFolderModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        lang={lang}
      />

      <TrainingGuideModal
        isOpen={isTrainingGuideModalOpen}
        onClose={() => setIsTrainingGuideModalOpen(false)}
        lang={lang}
      />

      <ScreenshotModal
        url={previewScreenshotUrl}
        onClose={() => setPreviewScreenshotUrl(null)}
        onOpenVisualDiff={(url) => {
          setVisualDiffData({ screenshot: url, stepName: 'Live Captured Step' });
          setIsVisualDiffOpen(true);
        }}
      />

      <WebVitalsModal
        isOpen={isWebVitalsOpen}
        onClose={() => setIsWebVitalsOpen(false)}
        lang={lang}
        initialStore={selectedMasterDomain === 'novatech-de' || (selectedMasterDomain as any) === 'tulpar-de' || activeProject?.baseUrl?.includes('.de') ? 'novaDe' : 'novaTr'}
      />

      <VisualRegressionModal
        isOpen={isVisualDiffOpen}
        onClose={() => setIsVisualDiffOpen(false)}
        baselineUrl={visualDiffData.screenshot || '/screenshots/novatech_home_live.png'}
        currentUrl={visualDiffData.screenshot || '/screenshots/novatech_home_live.png'}
        stepName={visualDiffData.stepName || 'Storefront & Layout Visual Regression'}
        targetDomain={selectedMasterDomain === 'novatech-de' || (selectedMasterDomain as any) === 'tulpar-de' ? 'novatech.de' : 'novatech.com.tr'}
        lang={lang}
      />

      <PlaywrightCodeModal
        isOpen={isPlaywrightCodeModalOpen}
        onClose={() => setIsPlaywrightCodeModalOpen(false)}
        scenario={activeScenario}
        viewport={activeViewport}
        lang={lang}
      />

      <SelfHealingModal
        isOpen={isSelfHealingModalOpen}
        onClose={() => setIsSelfHealingModalOpen(false)}
        lang={lang}
      />

      <DemoStoreModal
        isOpen={isLiveSiteModalOpen}
        onClose={() => setIsLiveSiteModalOpen(false)}
      />
    </div>
  );
}

export default App;
