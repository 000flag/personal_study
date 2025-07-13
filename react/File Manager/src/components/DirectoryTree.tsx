// src/components/DirectoryTree.tsx
import React, { useEffect, useState, FC, ElementType } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { fetchDirectoryTree } from '../api/api';
import '../styles/Tree.css';

type Dir = { id: string; name: string; children?: Dir[] };

interface Props {
  selected: string;
  onSelect: (path: string) => void;
  searchQuery: string;
}

const OpenIcon = FaFolderOpen as ElementType;
const ClosedIcon = FaFolder as ElementType;

/** 검색어에 맞춰 Tree를 필터링해주는 함수 (reduce 버전) */
const filterTree = (nodes: Dir[], query: string): Dir[] => {
  const q = query.trim().toLowerCase();
  return nodes.reduce<Dir[]>((acc, node) => {
    const matchedChildren = node.children
      ? filterTree(node.children, q)
      : [];
    if (
      node.name.toLowerCase().includes(q) ||
      matchedChildren.length > 0
    ) {
      acc.push({
        ...node,
        children: matchedChildren.length > 0 ? matchedChildren : undefined,
      });
    }
    return acc;
  }, []);
};

interface NodeProps {
  node: Dir;
  level: number;
  selected: string;
  onSelect: (path: string) => void;
  searchQuery: string;
}

const TreeNode: FC<NodeProps> = ({
  node,
  level,
  selected,
  onSelect,
  searchQuery,
}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const isSearching = searchQuery.trim() !== '';

  // 검색 중이면 매치된 부모는 무조건 펼치기
  const effectiveOpen = hasChildren && (isSearching || open);

  const handleClick = () => {
    onSelect(node.id);
    if (!isSearching && hasChildren) {
      setOpen(o => !o);
    }
  };

  return (
    <>
      <ListGroup.Item
        action
        active={selected === node.id}
        className="tree-node"
        style={{ paddingLeft: level * 16 + 8 }}
        onClick={handleClick}
      >
        {hasChildren ? (
          effectiveOpen
            ? <OpenIcon style={{ minWidth: 16 }} />
            : <ClosedIcon style={{ minWidth: 16 }} />
        ) : (
          <ClosedIcon style={{ minWidth: 16, opacity: 0.5 }} />
        )}
        <span style={{ marginLeft: 8 }}>{node.name}</span>
      </ListGroup.Item>

      {hasChildren && effectiveOpen && (
        <div className="tree-children">
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selected={selected}
              onSelect={onSelect}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </>
  );
};

const DirectoryTree: FC<Props> = ({
  selected,
  onSelect,
  searchQuery,
}) => {
  const [dirs, setDirs] = useState<Dir[]>([]);

  useEffect(() => {
    fetchDirectoryTree().then(setDirs);
  }, []);

  const displayData = searchQuery.trim()
    ? filterTree(dirs, searchQuery)
    : dirs;

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <ListGroup variant="flush">
        {displayData.map(dir => (
          <TreeNode
            key={dir.id}
            node={dir}
            level={0}
            selected={selected}
            onSelect={onSelect}
            searchQuery={searchQuery}
          />
        ))}
      </ListGroup>
    </div>
  );
};

export default DirectoryTree;
