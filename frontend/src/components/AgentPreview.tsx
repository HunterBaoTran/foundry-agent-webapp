import React, { useMemo, useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { SettingsPanel } from './core/SettingsPanel';
import { BuiltWithBadge } from './core/BuiltWithBadge';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import { ChatService } from '../services/chatService';
import { useAppContext } from '../contexts/AppContext';
import { Dashboard } from './Dashboard';
import styles from './AgentPreview.module.css';

interface AgentPreviewProps {
  agentId: string;
  agentName: string;
  agentDescription?: string;
  agentLogo?: string;
}

type AppPage = 'dashboard' | 'chat';

export const AgentPreview: React.FC<AgentPreviewProps> = ({ agentName, agentDescription, agentLogo }) => {
  const { chat } = useAppState();
  const { dispatch } = useAppContext();
  const { getAccessToken } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePage, setActivePage] = useState<AppPage>('dashboard');

  // Create service instances
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  const chatService = useMemo(() => {
    return new ChatService(apiUrl, getAccessToken, dispatch);
  }, [apiUrl, getAccessToken, dispatch]);

  const handleSendMessage = async (text: string, files?: File[]) => {
    await chatService.sendMessage(text, chat.currentConversationId, files);
  };

  const handleClearError = () => {
    chatService.clearError();
  };

  const handleNewChat = () => {
    chatService.clearChat();
  };

  const handleCancelStream = () => {
    chatService.cancelStream();
  };

  const getNavButtonClass = (page: AppPage) => {
    return `${styles.navButton} ${activePage === page ? styles.navButtonActive : ''}`.trim();
  };

  return (
    <div className={styles.content}>
      <div className={styles.layout}>
        <nav className={styles.sidebar} aria-label="Primary">
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>Finance Workspace</span>
            <span className={styles.sidebarSubtitle}>P&L + Agent</span>
          </div>

          <div className={styles.navGroup}>
            <button
              type="button"
              className={getNavButtonClass('dashboard')}
              onClick={() => setActivePage('dashboard')}
              aria-current={activePage === 'dashboard' ? 'page' : undefined}
            >
              <span className={styles.navLabel}>P&L Dashboard</span>
              <span className={styles.navMeta}>KPIs, trends, breakdowns</span>
            </button>
            <button
              type="button"
              className={getNavButtonClass('chat')}
              onClick={() => setActivePage('chat')}
              aria-current={activePage === 'chat' ? 'page' : undefined}
            >
              <span className={styles.navLabel}>Chatbot</span>
              <span className={styles.navMeta}>Ask about metrics & drivers</span>
            </button>
          </div>
        </nav>

        <div className={styles.mainContent}>
          <div className={styles.page}>
            {activePage === 'dashboard' ? (
              <Dashboard />
            ) : (
              <ChatInterface 
                messages={chat.messages}
                status={chat.status}
                error={chat.error}
                streamingMessageId={chat.streamingMessageId}
                onSendMessage={handleSendMessage}
                onClearError={handleClearError}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onNewChat={handleNewChat}
                onCancelStream={handleCancelStream}
                hasMessages={chat.messages.length > 0}
                disabled={false}
                agentName={agentName}
                agentDescription={agentDescription}
                agentLogo={agentLogo}
              />
            )}
          </div>

          <BuiltWithBadge className={styles.builtWithBadge} />
        </div>
      </div>
      
      <SettingsPanel
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};
