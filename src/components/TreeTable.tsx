import React, { useState, useMemo } from 'react';
import { users, User } from '../data/users';
import { parseBalance } from '../utils/parseBalance';
import TableRow from './TableRow';

const buildTree = (list: User[]): User[] => {
  const map: Record<number, User> = {};
  const roots: User[] = [];

  list.forEach(item => { map[item.id] = { ...item, children: [] }; });
  list.forEach(item => {
    if (item.parentId === 0) roots.push(map[item.id]);
    else if (map[item.parentId]) map[item.parentId].children!.push(map[item.id]);
  });

  return roots;
};

const TreeTable: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [filterActive, setFilterActive] = useState(false);
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggle = (id: number) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const sortedAndFilteredData = useMemo(() => {
    let items = [...users];
    if (filterActive) items = items.filter(u => u.isActive);

    if (sortField) {
      items.sort((a, b) => {
        let aVal: string | number = sortField === 'balance' ? parseBalance(a.balance) : a[sortField]!.toString().toLowerCase();
        let bVal: string | number = sortField === 'balance' ? parseBalance(b.balance) : b[sortField]!.toString().toLowerCase();
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return buildTree(items);
  }, [filterActive, sortField, sortOrder]);

  const handleSort = (field: keyof User) => {
    if (sortField === field) setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortOrder('asc'); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Дерево пользователей</h1>
      <label className="mb-3 inline-flex items-center">
        <input
          type="checkbox"
          checked={filterActive}
          onChange={() => setFilterActive(prev => !prev)}
          className="mr-2 w-4 h-4"
        />
        <span className="text-gray-700">Показать только активных</span>
      </label>
      <div className="tree-table-container">
  <table className="tree-table">
    <thead>
      <tr>
        <th>Name</th>
        <th onClick={() => handleSort('email')} className="cursor-pointer">
          Email {sortField === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
        </th>
        <th onClick={() => handleSort('balance')} className="cursor-pointer">
          Balance {sortField === 'balance' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
        </th>
        <th>Active</th>
      </tr>
    </thead>
    <tbody>
      {sortedAndFilteredData.map(node => (
        <TableRow key={node.id} node={node} level={0} expanded={expanded} toggle={toggle} />
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default TreeTable;
