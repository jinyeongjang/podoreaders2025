import React from 'react';

interface TabProps {
  id: string;
  label: React.ReactNode;
  children?: React.ReactNode;
}

interface TabsProps {
  selectedTab: string;
  onChange: (tabId: string) => void;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export const Tabs: React.FC<TabsProps> = ({ selectedTab, onChange, children }) => {
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.props.id}
            onClick={() => onChange(tab.props.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              selectedTab === tab.props.id
                ? 'bg-indigo-500 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            {tab.props.label}
          </button>
        ))}
      </div>
    </div>
  );
};
