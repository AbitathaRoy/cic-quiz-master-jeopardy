import React from 'react';
import { IconSettings } from '../icons/Icons';

const BlockTile = ({ block, isAdmin, onClick }) => {
  const hasContent = block.question?.content?.length > 0;
  let cls = 'block-tile';
  cls += hasContent ? ' has-content' : ' empty';
  if (block.isRead && !isAdmin) cls += ' read';
  
  const style = block.logoUrl ? { backgroundImage: `url(${block.logoUrl})` } : {};
  
  return (
    <button id={block.id} className={cls} onClick={() => onClick(block.id)} style={style}>
      <span className="block-number">{block.row + 1}</span>
    </button>
  );
};

export default BlockTile;
