import './styles.scss';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableItem from './item';

interface DraggableListProps {
  list: Array<{ id: string; content: React.ReactNode }>;
}

const DraggableList = ({ list }: DraggableListProps) => {
  const [items, setItems] = useState(list);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!items?.length) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <DraggableItem key={item.id} id={item.id}>
            {item.content}
          </DraggableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DraggableList;
