import styles from './Dashboard.module.css';

interface KpiMetric {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
}

interface PnlRow {
  label: string;
  current: string;
  previous: string;
  variance: string;
}

interface BridgeRow {
  label: string;
  value: string;
  width: string;
  tone: 'positive' | 'negative' | 'neutral';
}

const kpis: KpiMetric[] = [
  { label: 'Revenue', value: '$4.2M', delta: '+8.4% MoM', trend: 'up' },
  { label: 'COGS', value: '$1.6M', delta: '-2.1% MoM', trend: 'down' },
  { label: 'Gross Margin', value: '62.4%', delta: '+1.8 pts', trend: 'up' },
  { label: 'Operating Expense', value: '$1.2M', delta: '+3.2% MoM', trend: 'up' },
  { label: 'EBITDA', value: '$980K', delta: '+5.6% MoM', trend: 'up' },
  { label: 'Net Income', value: '$620K', delta: '+4.0% MoM', trend: 'up' },
];

const pnlRows: PnlRow[] = [
  { label: 'Revenue', current: '$4.2M', previous: '$3.9M', variance: '+$0.3M' },
  { label: 'Cost of Goods Sold', current: '$1.6M', previous: '$1.7M', variance: '-$0.1M' },
  { label: 'Gross Profit', current: '$2.6M', previous: '$2.2M', variance: '+$0.4M' },
  { label: 'Operating Expense', current: '$1.2M', previous: '$1.1M', variance: '+$0.1M' },
  { label: 'EBITDA', current: '$980K', previous: '$920K', variance: '+$60K' },
  { label: 'Net Income', current: '$620K', previous: '$596K', variance: '+$24K' },
];

const bridgeRows: BridgeRow[] = [
  { label: 'Revenue', value: '$4.2M', width: '100%', tone: 'positive' },
  { label: 'COGS', value: '-$1.6M', width: '58%', tone: 'negative' },
  { label: 'Opex', value: '-$1.2M', width: '43%', tone: 'negative' },
  { label: 'One-time Items', value: '+$0.1M', width: '12%', tone: 'positive' },
  { label: 'Net Income', value: '$620K', width: '34%', tone: 'neutral' },
];

const getTrendClass = (trend: KpiMetric['trend']) => {
  if (trend === 'up') return styles.kpiTrendUp;
  if (trend === 'down') return styles.kpiTrendDown;
  return styles.kpiTrendFlat;
};

const getBridgeClass = (tone: BridgeRow['tone']) => {
  if (tone === 'positive') return styles.bridgeBarPositive;
  if (tone === 'negative') return styles.bridgeBarNegative;
  return styles.bridgeBarNeutral;
};

export function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>P&L Dashboard</p>
          <h1 className={styles.title}>Financial performance snapshot</h1>
          <p className={styles.subtitle}>FY26 Q1 · Updated today · USD</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton} type="button">Export</button>
          <button className={styles.actionButtonSecondary} type="button">Filter</button>
        </div>
      </header>

      <section className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <span className={styles.kpiLabel}>{kpi.label}</span>
            <span className={styles.kpiValue}>{kpi.value}</span>
            <span className={getTrendClass(kpi.trend)}>{kpi.delta}</span>
          </div>
        ))}
      </section>

      <section className={styles.split}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Margin bridge</h2>
            <span className={styles.panelMeta}>Contribution to net income</span>
          </div>
          <div className={styles.bridge}>
            {bridgeRows.map((row) => (
              <div key={row.label} className={styles.bridgeRow}>
                <span className={styles.bridgeLabel}>{row.label}</span>
                <div className={styles.bridgeTrack}>
                  <span
                    className={`${styles.bridgeBar} ${getBridgeClass(row.tone)}`}
                    style={{ width: row.width }}
                  />
                </div>
                <span className={styles.bridgeValue}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>P&L detail</h2>
            <span className={styles.panelMeta}>Current vs previous month</span>
          </div>
          <div className={styles.pnlTable}>
            <div className={styles.pnlRowHeader}>
              <span>Line item</span>
              <span>Current</span>
              <span>Previous</span>
              <span>Variance</span>
            </div>
            {pnlRows.map((row) => (
              <div key={row.label} className={styles.pnlRow}>
                <span>{row.label}</span>
                <span>{row.current}</span>
                <span>{row.previous}</span>
                <span className={styles.pnlVariance}>{row.variance}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
