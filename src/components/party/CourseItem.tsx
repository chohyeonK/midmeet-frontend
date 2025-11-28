import React, { useCallback, useEffect, useState } from 'react';
import Button from '../common/Button';
import type { Course, TransformedTagData } from '../../pages/party/Create';
import Input from '../common/Input';
import TagSelector from './TagSelector';
import { FILTER_CATEGORIES } from '../../data/filterCategory';

interface CourseItemProps {
  index: number;
  course: Course;
  onUpdate: (index: number, updatedCourse: Course) => void;
  onRemove: (index: number) => void;
}

interface TagState {
  primary: string[];
  secondary: string[];
}

// const allTags = [
//   '한식',
//   '양식',
//   '일식',
//   '중식',
//   '고기',
//   '해산물',
//   '분식',
//   '디저트',
//   '카페',
//   '술집',
//   '밥집',
//   '루프탑',
//   '바(Bar)',
//   '오마카세',
//   '시끌벅적',
//   '조용한',
//   '분위기 좋은',
//   '가성비',
//   '모던한',
//   '캐주얼한',
//   '따뜻한',
//   '식사',
//   '가볍게 한잔',
//   '진지한 대화',
//   '데이트',
//   '스터디',
//   '회식',
//   '쇼핑',
//   '산책',
//   '영화',
//   '전시회',
// ];

type CategoryKeys = keyof typeof FILTER_CATEGORIES;
type TagMap = Record<CategoryKeys, TagState>;
type GroupType = 'primary' | 'secondary';

const CourseItem: React.FC<CourseItemProps> = ({ index, course, onUpdate, onRemove }) => {
  // const [selectedTags, setSelectedTags] = useState<string[]>(course.tag ? course.tag.split(',').map((t) => t.trim()) : []);
  const getInitialTagData = (tag: TransformedTagData | null): TransformedTagData => tag || { category: null, primaryQueries: [], secondaryFilters: [] };

  const initialTagData = getInitialTagData(course.tag);

  const [selectedCategory, setSelectedCategory] = useState<CategoryKeys | null>(initialTagData.category);
  const [selectedTags, setSelectedTags] = useState<TagMap>(() => {
    const initialMap: TagMap = Object.keys(FILTER_CATEGORIES).reduce((acc, code) => {
      acc[code as CategoryKeys] = { primary: [], secondary: [] };
      return acc;
    }, {} as TagMap);

    if (initialTagData.category) {
      // 저장된 filterKey 배열을 가져옵니다.
      const savedFilterKeys = initialTagData.secondaryFilters;
      const currentData = FILTER_CATEGORIES[initialTagData.category];
      const secondaryGroup = currentData.subGroups[1];

      // ✅ filterKey를 name으로 변환하여 selectedTags에 할당
      const secondaryNames = savedFilterKeys
        .map((key) => {
          const tag = secondaryGroup.tags.find((tag) => 'filterKey' in tag && tag.filterKey === key);
          return tag ? tag.name : null;
        })
        .filter((name) => name !== null) as string[];

      initialMap[initialTagData.category] = {
        primary: initialTagData.primaryQueries, // primary는 name과 query가 같으므로 그대로 사용
        secondary: secondaryNames, // ✅ 변환된 name 사용
      };
    }
    return initialMap;
  });

  // 태그 데이터를 최종 JSON 형식으로 가공하는 함수 (컴포넌트 내부)
  const getTransformedTags = useCallback(
    (currentSelectedTags: TagMap, currentSelectedCategory: CategoryKeys | null) => {
      if (!currentSelectedCategory || !FILTER_CATEGORIES[currentSelectedCategory]) {
        return null;
      }

      const currentData = FILTER_CATEGORIES[currentSelectedCategory];
      const currentSelection = currentSelectedTags[currentSelectedCategory];

      // 2차 필터(secondaryFilters)는 name을 filterKey로 변환해야 함
      const secondaryFilters = currentSelection.secondary.map((tagName) => {
        // 2차 그룹 데이터 (subGroups[1])를 찾아 filterKey 매핑
        const secondaryGroup = currentData.subGroups[1];

        const tagData = secondaryGroup.tags.find((tag) => tag.name === tagName);

        // tag.filterKey가 있으면 사용 (TS 오류 방지를 위해 속성 체크)
        return tagData && 'filterKey' in tagData ? tagData.filterKey : tagName;
      });

      // 선택된 데이터가 없다면 null을 반환하여 DB에 저장되지 않도록 함
      if (currentSelection.primary.length === 0 && secondaryFilters.length === 0) {
        return null;
      }

      return {
        category: currentSelectedCategory,
        primaryQueries: currentSelection.primary,
        secondaryFilters: secondaryFilters,
      };
    },
    [FILTER_CATEGORIES],
  );

  const currentCategoryData = selectedCategory ? FILTER_CATEGORIES[selectedCategory] : null;

  // 태그 선택/해제 핸들러
  const handleTagToggle = useCallback(
    (groupType: GroupType, tagName: string, isMultiSelect: boolean) => {
      if (!selectedCategory) return;

      setSelectedTags((prevTags) => {
        const currentSelected = prevTags[selectedCategory][groupType];
        let newSelected;

        if (currentSelected.includes(tagName)) {
          newSelected = currentSelected.filter((name) => name !== tagName);
        } else {
          if (isMultiSelect) {
            newSelected = [...currentSelected, tagName];
          } else {
            newSelected = [tagName];
          }
        }

        // 새로운 selectedTags 객체를 생성
        const newTags = {
          ...prevTags,
          [selectedCategory]: {
            ...prevTags[selectedCategory],
            [groupType]: newSelected,
          },
        };

        // ✅ 상태가 업데이트된 직후의 newTags를 사용하여 부모 업데이트 로직 실행
        const transformedTags = getTransformedTags(newTags, selectedCategory);
        // console.log('transformedTags', transformedTags);

        onUpdate(index, {
          ...course,
          // transformedTags가 null이면 tag 필드도 null로 저장합니다.
          tag: transformedTags,
        });

        return newTags; // 새로운 상태 반환
      });
    },
    [selectedCategory, index, course, onUpdate, getTransformedTags],
  );

  // const handleTagClick = (tag: string) => {
  //   let updatedTags;
  //   if (selectedTags.includes(tag)) {
  //     updatedTags = selectedTags.filter((t) => t !== tag);
  //   } else {
  //     updatedTags = [...selectedTags, tag];
  //   }

  //   setSelectedTags(updatedTags);
  //   onUpdate(index, { ...course, tag: updatedTags.join(', ') });
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const tags = e.target.value.split(',').map((t) => t.trim());
  //   setSelectedTags(tags);
  //   onUpdate(index, { ...course, tag: e.target.value });
  // };

  return (
    <>
      <div className='flex flex-col space-y-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm my-3'>
        <div className='flex items-center space-x-2 justify-between'>
          <p>코스 {course.course_no}</p>
          {/* <Input type='text' name='course' value={selectedTags.join(', ')} onChange={handleInputChange} className='flex-1' /> */}
          <Button onClick={() => onRemove(index)} className='bg-red-500' buttonName='삭제' />
        </div>

        <div className='mt-2'>
          {/* <TagSelector allTags={category} selectedTags={selectedTags} onTagClick={handleTagClick} /> */}
          {/* --- 1. 대분류 (카테고리 탭) 렌더링 --- */}
          <div className='flex space-x-3 overflow-x-auto'>
            {Object.keys(FILTER_CATEGORIES).map((code) => {
              // 1. code 변수를 유효한 키 타입으로 변환
              const categoryKey = code as CategoryKeys;

              // 2. 변환된 categoryKey를 사용하여 접근
              const cat = FILTER_CATEGORIES[categoryKey];
              const isActive = categoryKey === selectedCategory;

              return (
                <button
                  key={code}
                  onClick={() => setSelectedCategory(categoryKey)}
                  className={`
          px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
          ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
        `}
                >
                  {cat.icon} {cat.label}
                </button>
              );
            })}
          </div>

          {/* --- 2. 소분류 태그 그룹 렌더링 (선택된 카테고리만 표시) --- */}
          {selectedCategory && currentCategoryData && (
            <div className='pt-4 space-y-6 animate-fadeIn'>
              {' '}
              {/* 하위 분류가 나타날 때 애니메이션 추가 (Tailwind CSS 설정에 따라 작동) */}
              {currentCategoryData.subGroups.map((group, groupIndex) => {
                const groupType = groupIndex === 0 ? 'primary' : 'secondary';
                const currentSelection = selectedTags[selectedCategory][groupType];

                return (
                  <div key={group.groupName} className='p-4 rounded-lg bg-gray-50 border border-gray-200 rounded-lg'>
                    <h4 className='text-left text-md font-semibold mb-3 text-gray-700'>{group.groupName}</h4>
                    <div className='flex flex-wrap gap-2'>
                      {group.tags.map((tag) => {
                        const isSelected = currentSelection.includes(tag.name);

                        return (
                          <button
                            key={tag.name}
                            onClick={() => handleTagToggle(groupType, tag.name, group.multiSelect)}
                            className={`
                          px-3 py-1 text-sm rounded-full border transition-colors duration-200
                          ${isSelected ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-100'}
                        `}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseItem;
