import React from 'react';
import { User } from '../data/users';

interface TableRowProps {
  node: User;
  level: number;
  expanded: Record<number, boolean>;
  toggle: (id: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  node,
  level,
  expanded,
  toggle,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded[node.id];

  return (
    <>
      <tr
        className={`tree-row level-${level}`}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        <td className="p-2">
          {hasChildren && (
            <button className="expand-button" onClick={() => toggle(node.id)}>
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {node.name}
        </td>
        <td>{node.email}</td>
        <td>{node.balance}</td>
        <td className={node.isActive ? 'active' : 'inactive'}>
          {node.isActive ? 'Active' : 'Inactive'}
        </td>
      </tr>
      {hasChildren &&
        isExpanded &&
        node.children!.map((child) => (
          <TableRow
            key={child.id}
            node={child}
            level={level + 1}
            expanded={expanded}
            toggle={toggle}
          />
        ))}
    </>
  );
};

export default TableRow;
