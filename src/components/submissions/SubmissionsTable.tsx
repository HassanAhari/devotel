"use client";

import { Button, Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Submission } from "@/lib/types";
import { useTranslations } from "next-intl";
import { createContext, useContext, useMemo, useState } from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

interface SubmissionsTableProps {
  data: Submission[];
  columnNames: string[];
}

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

export default function SubmissionsTable({
  data,
  columnNames,
}: SubmissionsTableProps) {
  const t = useTranslations("SubmissionsPage");
  let tableColumns: ColumnsType<Submission> = [
    { key: "sort", align: "center", width: 80, render: () => <DragHandle /> },
  ];

  const [dataSource, setDataSource] = useState<Submission[]>(data);

  tableColumns.push(
    ...columnNames.map((col) => {
      const key = col.toLowerCase().replaceAll(" ", "_");

      const baseColumn: ColumnsType<Submission>[number] = {
        title: col,
        dataIndex: col,
        key,
      };

      const filterOptions: Record<string, { text: string; value: string }[]> = {
        gender: [
          { text: "Male", value: "Male" },
          { text: "Female", value: "Female" },
        ],
        insurance_type: [
          { text: "Health", value: "Health" },
          { text: "Home", value: "Home" },
          { text: "Car", value: "Car" },
        ],
      };

      if (filterOptions[key]) {
        return {
          ...baseColumn,
          filters: filterOptions[key],
          onFilter: (value: any, record: any) =>
            record[col]?.indexOf(value as string) === 0,
        };
      }

      if (key === "age") {
        return {
          ...baseColumn,
          sorter: (a: Submission, b: Submission) => a[col] - b[col],
        };
      }

      return baseColumn;
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.id === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.id === over?.id
        );
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  return (
    <Card title={t("title")} variant="borderless">
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            dataSource={dataSource}
            columns={tableColumns}
            rowSelection={{ type: "radio" }}
            rowKey="id"
            pagination={false}
            components={{ body: { row: Row } }}
          />
        </SortableContext>
      </DndContext>
    </Card>
  );
}
