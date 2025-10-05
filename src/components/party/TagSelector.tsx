import React from 'react';

interface TagSelectorProps {
  allTags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ allTags, selectedTags, onTagClick }) => {
  return (
    <div>
      <div className='flex flex-wrap gap-2'>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className={`
              px-3 py-1.5 rounded-full border 
              ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}
            `}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
