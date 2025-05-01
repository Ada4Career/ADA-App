import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import React, { createContext, ReactNode, useContext } from 'react';

// Context to share data between components
interface DraggableContextType {
  onReorder: (result: DropResult) => void;
  droppableId: string;
}

const DraggableContext = createContext<DraggableContextType | undefined>(
  undefined
);

// DraggableArea props
interface DraggableAreaProps {
  children: ReactNode;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  droppableId?: string;
  className?: string;
}

// DraggableItem props (no handle)
interface DraggableItemProps {
  id: string;
  index: number;
  children: ReactNode;
  className?: string;
}

// DraggableItemWithHandle props
interface DraggableItemWithHandleProps extends DraggableItemProps {
  handleClassName?: string;
}

/**
 * DraggableArea component - wraps multiple draggable items
 */
export const DraggableArea: React.FC<DraggableAreaProps> = ({
  children,
  onReorder,
  droppableId = 'draggable-list',
  className = '',
}) => {
  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list or no change
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    // Call the callback with source and destination indices
    onReorder(result.source.index, result.destination.index);
  };

  // Context value
  const contextValue: DraggableContextType = {
    onReorder: handleDragEnd,
    droppableId,
  };

  return (
    <DraggableContext.Provider value={contextValue}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`bg-gray-50 p-4 rounded-lg border border-gray-200 ${className}`}
            >
              {children}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </DraggableContext.Provider>
  );
};

/**
 * DraggableItem component - fully draggable (no handle)
 */
export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  index,
  children,
  className = '',
}) => {
  // Get context from DraggableArea
  const context = useContext(DraggableContext);

  if (!context) {
    throw new Error('DraggableItem must be used within a DraggableArea');
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps} // Makes the entire component draggable
          className={`p-3 mb-2 bg-white border rounded-md cursor-grab ${
            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
          } ${className}`}
          style={provided.draggableProps.style}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
};

/**
 * DraggableItemWithHandle component - only draggable by the handle
 */
export const DraggableItemWithHandle: React.FC<
  DraggableItemWithHandleProps
> = ({ id, index, children, className = '', handleClassName = '' }) => {
  // Get context from DraggableArea
  const context = useContext(DraggableContext);

  if (!context) {
    throw new Error(
      'DraggableItemWithHandle must be used within a DraggableArea'
    );
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-center p-3 mb-2 bg-white border rounded-md ${
            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
          } ${className}`}
          style={provided.draggableProps.style}
        >
          {/* Drag Handle */}
          <div
            {...provided.dragHandleProps}
            className={`w-8 h-10 mr-3 flex items-center justify-center cursor-grab ${handleClassName}`}
          >
            {/* Drag handle dots */}
            <div className='flex flex-col space-y-1'>
              <div className='flex space-x-1'>
                <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
              </div>
              <div className='flex space-x-1'>
                <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
              </div>
              <div className='flex space-x-1'>
                <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className='flex-1'>{children}</div>
        </div>
      )}
    </Draggable>
  );
};

const components = { DraggableArea, DraggableItem, DraggableItemWithHandle };
export default components;
