"use client";
import { Container } from "@/components/Container";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function Home() {
  return (
    <div className="w-screen h-screen">
      <DndProvider backend={HTML5Backend}>
        <Container hideSourceOnDrag={true} />
      </DndProvider>
    </div>
  );
}

export default Home;
