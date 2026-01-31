import { useState, useRef, useMemo } from "react";
import {
  Trash2,
  RotateCw,
  Activity,
  Plus,
  Minus,
  Camera,
  ArrowRightLeft,
  Plug,
} from "lucide-react";

// --- Constantes & Types ---
const GRID_SIZE = 30;

const COMPONENT_TYPES = {
  GENERATOR: "generator",
  GENERATOR_G: "generator_g",
  BULB: "bulb",
  RESISTOR: "resistor",
  DIODE: "diode",
  LED: "led",
  AMMETER: "ammeter",
  VOLTMETER: "voltmeter",
  OHMMETER: "ohmmeter",
  SWITCH_OPEN: "switch_open",
  SWITCH_CLOSED: "switch_closed",
  MOTOR: "motor",
  JOINT: "joint",
};

const STROKE_THIN = 0.07;
const STROKE_THICK = 0.22;
const WIRE_THICKNESS = GRID_SIZE * STROKE_THIN;

// Configuration des composants
const COMPONENT_CONFIGS = {
  [COMPONENT_TYPES.GENERATOR]: {
    label: "Pile",
    width: 4,
    height: 2,
    ports: [
      { x: -2, y: 0, id: "L" },
      { x: 2, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none" strokeLinecap="round">
        <line x1="-2" y1="0" x2="-0.2" y2="0" />
        <line
          x1="-0.2"
          y1="-0.4"
          x2="-0.2"
          y2="0.4"
          strokeWidth={STROKE_THICK}
          strokeLinecap="butt"
        />
        <line x1="0.2" y1="-0.8" x2="0.2" y2="0.8" />
        <line x1="0.2" y1="0" x2="2" y2="0" />
        <text
          x="0.4"
          y="-1.0"
          fontSize="0.6"
          fill={color}
          stroke="none"
          fontWeight="normal"
          style={{ userSelect: "none" }}
        >
          +
        </text>
      </g>
    ),
  },
  [COMPONENT_TYPES.GENERATOR_G]: {
    label: "Générateur",
    width: 3,
    height: 2,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.8" y2="0" />
        <line x1="0.8" y1="0" x2="1.5" y2="0" />
        <circle cx="0" cy="0" r="0.8" />
        <text
          x="0"
          y="0.3"
          textAnchor="middle"
          fontSize="0.9"
          fill={color}
          stroke="none"
          fontWeight="bold"
          style={{ userSelect: "none" }}
        >
          G
        </text>
        <text
          x="-0.4"
          y="-1.0"
          fontSize="0.5"
          fill={color}
          stroke="none"
          fontWeight="normal"
          style={{ userSelect: "none" }}
        >
          +
        </text>
      </g>
    ),
  },
  [COMPONENT_TYPES.BULB]: {
    label: "Lampe",
    width: 3,
    height: 2,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.8" y2="0" />
        <line x1="0.8" y1="0" x2="1.5" y2="0" />
        <circle cx="0" cy="0" r="0.8" />
        <line x1="-0.56" y1="-0.56" x2="0.56" y2="0.56" />
        <line x1="-0.56" y1="0.56" x2="0.56" y2="-0.56" />
      </g>
    ),
  },
  [COMPONENT_TYPES.RESISTOR]: {
    label: "Résistance",
    width: 3,
    height: 1,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.8" y2="0" />
        <line x1="0.8" y1="0" x2="1.5" y2="0" />
        <rect x="-0.8" y="-0.3" width="1.6" height="0.6" />
      </g>
    ),
  },
  [COMPONENT_TYPES.DIODE]: {
    label: "Diode",
    width: 3,
    height: 2,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.5" y2="0" />
        <line x1="0.5" y1="0" x2="1.5" y2="0" />
        <polygon points="-0.5,-0.5 -0.5,0.5 0.5,0" fill="none" strokeLinejoin="round" />
        <line x1="0.5" y1="-0.5" x2="0.5" y2="0.5" />
      </g>
    ),
  },
  [COMPONENT_TYPES.LED]: {
    label: "DEL",
    width: 3,
    height: 2,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.5" y2="0" />
        <line x1="0.5" y1="0" x2="1.5" y2="0" />
        <polygon points="-0.5,-0.5 -0.5,0.5 0.5,0" fill="none" strokeLinejoin="round" />
        <line x1="0.5" y1="-0.5" x2="0.5" y2="0.5" />
        <g strokeWidth={STROKE_THIN * 0.8}>
          <line x1="-0.2" y1="-0.6" x2="0.2" y2="-1.0" />
          <line x1="0.1" y1="-0.6" x2="0.5" y2="-1.0" />
          <path d="M 0.2 -1.0 L 0.05 -1.0 M 0.2 -1.0 L 0.2 -0.85" />
          <path d="M 0.5 -1.0 L 0.35 -1.0 M 0.5 -1.0 L 0.5 -0.85" />
        </g>
      </g>
    ),
  },
  [COMPONENT_TYPES.AMMETER]: {
    label: "Ampèremètre",
    width: 3,
    height: 2,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.8" y2="0" />
        <line x1="0.8" y1="0" x2="1.5" y2="0" />
        <circle cx="0" cy="0" r="0.8" />
        <text
          x="0"
          y="0.3"
          textAnchor="middle"
          fontSize="0.9"
          fill={color}
          stroke="none"
          fontWeight="bold"
          style={{ userSelect: "none" }}
        >
          A
        </text>
      </g>
    ),
  },
  [COMPONENT_TYPES.VOLTMETER]: {
    label: "Voltmètre",
    width: 3,
    height: 2,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.8" y2="0" />
        <line x1="0.8" y1="0" x2="1.5" y2="0" />
        <circle cx="0" cy="0" r="0.8" />
        <text
          x="0"
          y="0.3"
          textAnchor="middle"
          fontSize="0.9"
          fill={color}
          stroke="none"
          fontWeight="bold"
          style={{ userSelect: "none" }}
        >
          V
        </text>
      </g>
    ),
  },
  [COMPONENT_TYPES.OHMMETER]: {
    label: "Ohmmètre",
    width: 3,
    height: 2,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.8" y2="0" />
        <line x1="0.8" y1="0" x2="1.5" y2="0" />
        <circle cx="0" cy="0" r="0.8" />
        <text
          x="0"
          y="0.3"
          textAnchor="middle"
          fontSize="0.9"
          fill={color}
          stroke="none"
          fontWeight="bold"
          style={{ userSelect: "none" }}
        >
          Ω
        </text>
      </g>
    ),
  },
  [COMPONENT_TYPES.SWITCH_OPEN]: {
    label: "Interr. (O)",
    width: 4,
    height: 2,
    ports: [
      { x: -2, y: 0, id: "L" },
      { x: 2, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-2" y1="0" x2="-0.8" y2="0" />
        <circle cx="-0.8" cy="0" r="0.15" />
        <line x1="0.8" y1="0" x2="2" y2="0" />
        <circle cx="0.8" cy="0" r="0.15" />
        <line x1="-0.7" y1="-0.1" x2="0.4" y2="-0.6" strokeLinecap="round" />
      </g>
    ),
  },
  [COMPONENT_TYPES.SWITCH_CLOSED]: {
    label: "Interr. (F)",
    width: 4,
    height: 1,
    ports: [
      { x: -2, y: 0, id: "L" },
      { x: 2, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-2" y1="0" x2="-0.8" y2="0" />
        <circle cx="-0.8" cy="0" r="0.15" />
        <line x1="0.8" y1="0" x2="2" y2="0" />
        <circle cx="0.8" cy="0" r="0.15" />
        <line x1="-0.65" y1="0" x2="0.65" y2="0" />
      </g>
    ),
  },
  [COMPONENT_TYPES.MOTOR]: {
    label: "Moteur",
    width: 3,
    height: 2,
    ports: [
      { x: -1.5, y: 0, id: "L" },
      { x: 1.5, y: 0, id: "R" },
    ],
    render: (color) => (
      <g stroke={color} strokeWidth={STROKE_THIN} fill="none">
        <line x1="-1.5" y1="0" x2="-0.8" y2="0" />
        <line x1="0.8" y1="0" x2="1.5" y2="0" />
        <circle cx="0" cy="0" r="0.8" />
        <text
          x="0"
          y="0.3"
          textAnchor="middle"
          fontSize="0.8"
          fill={color}
          stroke="none"
          fontWeight="bold"
          style={{ userSelect: "none" }}
        >
          M
        </text>
        <rect x="-0.9" y="-0.2" width="0.2" height="0.4" strokeWidth={STROKE_THIN / 2} />
        <rect x="0.7" y="-0.2" width="0.2" height="0.4" strokeWidth={STROKE_THIN / 2} />
      </g>
    ),
  },
  [COMPONENT_TYPES.JOINT]: {
    label: "",
    width: 0.5,
    height: 0.5,
    ports: [{ x: 0, y: 0, id: "center" }],
    render: (color) => <circle cx="0" cy="0" r="0.15" fill={color} stroke="none" />,
  },
};

const snapToGrid = (val) => Math.round(val / GRID_SIZE) * GRID_SIZE;

const getOrthogonalPos = (startX, startY, currentX, currentY) => {
  const dx = Math.abs(currentX - startX);
  const dy = Math.abs(currentY - startY);
  if (dx > dy) {
    return { x: currentX, y: startY };
  }
  return { x: startX, y: currentY };
};

const getSnappedComponentPosition = (type, x, y, rotation) => {
  const config = COMPONENT_CONFIGS[type];
  if (type === COMPONENT_TYPES.JOINT) return { x: snapToGrid(x), y: snapToGrid(y) };

  const portL = config.ports.find((p) => p.id === "L");
  const rad = (rotation * Math.PI) / 180;
  const px = portL.x * GRID_SIZE;
  const py = portL.y * GRID_SIZE;

  const rotatedDx = px * Math.cos(rad) - py * Math.sin(rad);
  const rotatedDy = px * Math.sin(rad) + py * Math.cos(rad);

  const targetPortX = Math.round((x + rotatedDx) / GRID_SIZE) * GRID_SIZE;
  const targetPortY = Math.round((y + rotatedDy) / GRID_SIZE) * GRID_SIZE;

  return {
    x: targetPortX - rotatedDx,
    y: targetPortY - rotatedDy,
  };
};

const getRotatedPortPosition = (compX, compY, port, rotation) => {
  const rad = (rotation * Math.PI) / 180;
  const px = port.x * GRID_SIZE;
  const py = port.y * GRID_SIZE;

  const rx = px * Math.cos(rad) - py * Math.sin(rad);
  const ry = px * Math.sin(rad) + py * Math.cos(rad);

  return {
    x: compX + rx,
    y: compY + ry,
    id: port.id,
  };
};

const getWirePath = (x1, y1, x2, y2) => {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
};

export default function CircuitBuilder() {
  const [elements, setElements] = useState([]);
  const [wires, setWires] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("select");
  const [drawingWire, setDrawingWire] = useState(null);

  // Custom Drag State for Palette
  const [newCompDrag, setNewCompDrag] = useState(null); // { type, x, y, offsetX, offsetY }

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPhotoMode, setIsPhotoMode] = useState(false);

  // CHANGEMENT: Mode 'blueprint' par défaut
  const [theme, setTheme] = useState("blueprint");

  const previousViewRef = useRef({ scale: 1, pan: { x: 0, y: 0 } });
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const nodePoints = useMemo(() => {
    const counts = new Map();
    wires.forEach((wire) => {
      const startComp = elements.find((e) => e.id === wire.startCompId);
      const endComp = elements.find((e) => e.id === wire.endCompId);
      if (!startComp || !endComp) return;

      const startConfig = COMPONENT_CONFIGS[startComp.type];
      const endConfig = COMPONENT_CONFIGS[endComp.type];

      const startPortDef = startConfig.ports.find((p) => p.id === wire.startPortId);
      const endPortDef = endConfig.ports.find((p) => p.id === wire.endPortId);

      if (!startPortDef || !endPortDef) return;

      const sPos = getRotatedPortPosition(
        startComp.x,
        startComp.y,
        startPortDef,
        startComp.rotation,
      );
      const ePos = getRotatedPortPosition(endComp.x, endComp.y, endPortDef, endComp.rotation);

      const sKey = `${Math.round(sPos.x)},${Math.round(sPos.y)}`;
      const eKey = `${Math.round(ePos.x)},${Math.round(ePos.y)}`;

      counts.set(sKey, (counts.get(sKey) || 0) + 1);
      counts.set(eKey, (counts.get(eKey) || 0) + 1);
    });
    const nodes = [];
    counts.forEach((count, key) => {
      if (count >= 3) {
        const [x, y] = key.split(",").map(Number);
        nodes.push({ x, y });
      }
    });
    return nodes;
  }, [wires, elements]);

  // --- Actions ---
  const deleteSelection = () => {
    if (selectedId) {
      if (wires.find((w) => w.id === selectedId)) {
        setWires(wires.filter((w) => w.id !== selectedId));
      } else {
        setElements(elements.filter((e) => e.id !== selectedId));
        setWires(wires.filter((w) => w.startCompId !== selectedId && w.endCompId !== selectedId));
      }
      setSelectedId(null);
    }
  };

  const clearAll = () => {
    if (window.confirm("Voulez-vous tout effacer ?")) {
      setElements([]);
      setWires([]);
      setSelectedId(null);
    }
  };

  const rotateSelection = () => {
    if (selectedId) {
      setElements(
        elements.map((el) => {
          if (el.id === selectedId) {
            return { ...el, rotation: (el.rotation + 90) % 360 };
          }
          return el;
        }),
      );
    }
  };

  const toggleCurrentOnSelection = () => {
    if (selectedId) {
      setWires(
        wires.map((w) => {
          if (w.id === selectedId) {
            return { ...w, showCurrent: !w.showCurrent };
          }
          return w;
        }),
      );
    }
  };

  const flipCurrentOnSelection = () => {
    if (selectedId) {
      setWires(
        wires.map((w) => {
          if (w.id === selectedId) {
            return { ...w, isReverse: !w.isReverse };
          }
          return w;
        }),
      );
    }
  };

  const fitToScreen = () => {
    if (elements.length === 0) return;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    elements.forEach((el) => {
      const config = COMPONENT_CONFIGS[el.type];
      const w = (config.width || 1) * GRID_SIZE;
      const h = (config.height || 1) * GRID_SIZE;
      minX = Math.min(minX, el.x - w / 2);
      maxX = Math.max(maxX, el.x + w / 2);
      minY = Math.min(minY, el.y - h / 2);
      maxY = Math.max(maxY, el.y + h / 2);
    });
    const padding = 100;
    const circuitWidth = maxX - minX + padding * 2;
    const circuitHeight = maxY - minY + padding * 2;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const container = svgRef.current?.getBoundingClientRect();
    if (!container) return;
    const scaleX = container.width / circuitWidth;
    const scaleY = container.height / circuitHeight;
    const newScale = Math.min(Math.min(scaleX, scaleY), 1.5);
    const newPanX = container.width / 2 - centerX * newScale;
    const newPanY = container.height / 2 - centerY * newScale;
    setPan({ x: newPanX, y: newPanY });
    setScale(newScale);
  };

  const togglePhotoMode = () => {
    const newStatus = !isPhotoMode;
    if (newStatus) {
      previousViewRef.current = { scale, pan };
      setIsPhotoMode(true);
      setSelectedId(null);
      setMode("select");
      setTimeout(() => fitToScreen(), 10);
    } else {
      setIsPhotoMode(false);
      setPan(previousViewRef.current.pan);
      setScale(previousViewRef.current.scale);
    }
  };

  // --- Palette & Drag Handling (Touch Optimized) ---

  const handlePalettePointerDown = (e, type) => {
    e.preventDefault();
    // Start custom drag
    const rect = e.currentTarget.getBoundingClientRect();
    setNewCompDrag({
      type,
      x: e.clientX,
      y: e.clientY,
      // Offset to center the ghost under finger roughly, or slightly above
      offsetX: 0,
      offsetY: 0,
    });
  };

  // Global Pointer Event Handler attached to the main container
  const handleGlobalPointerMove = (e) => {
    e.preventDefault();

    // Update dragged component ghost position
    if (newCompDrag) {
      setNewCompDrag((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
      return;
    }

    // Existing Canvas Pan / Wire Drawing Logic
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      if (selectedId && mode === "select" && !wires.find((w) => w.id === selectedId)) {
        setElements(
          elements.map((el) => {
            if (el.id === selectedId) {
              return { ...el, x: el.x + deltaX / scale, y: el.y + deltaY / scale };
            }
            return el;
          }),
        );
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (!selectedId) {
        setPan({ x: pan.x + deltaX, y: pan.y + deltaY });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
    if (drawingWire) {
      const rect = svgRef.current.getBoundingClientRect();
      const pos = {
        x: (e.clientX - rect.left - pan.x) / scale,
        y: (e.clientY - rect.top - pan.y) / scale,
      };
      const snappedMouseX = snapToGrid(pos.x);
      const snappedMouseY = snapToGrid(pos.y);
      const orthoPos = getOrthogonalPos(
        drawingWire.startX,
        drawingWire.startY,
        snappedMouseX,
        snappedMouseY,
      );
      setDrawingWire({ ...drawingWire, currentX: orthoPos.x, currentY: orthoPos.y });
    }
  };

  const handleGlobalPointerUp = (e) => {
    // Drop new component
    if (newCompDrag) {
      const rect = svgRef.current.getBoundingClientRect();
      // Check if dropped inside canvas
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const canvasX = (e.clientX - rect.left - pan.x) / scale;
        const canvasY = (e.clientY - rect.top - pan.y) / scale;
        const finalPos = getSnappedComponentPosition(newCompDrag.type, canvasX, canvasY, 0);
        const newEl = {
          id: Date.now().toString(),
          type: newCompDrag.type,
          x: finalPos.x,
          y: finalPos.y,
          rotation: 0,
        };
        setElements((prev) => [...prev, newEl]);
        setSelectedId(newEl.id);
        setMode("select");
      }
      setNewCompDrag(null);
      return;
    }

    // Existing Logic
    if (isDragging) {
      setIsDragging(false);
      if (selectedId && !wires.find((w) => w.id === selectedId)) {
        setElements(
          elements.map((el) => {
            if (el.id === selectedId) {
              const snapped = getSnappedComponentPosition(el.type, el.x, el.y, el.rotation);
              return { ...el, x: snapped.x, y: snapped.y };
            }
            return el;
          }),
        );
      }
    }
  };

  // --- Wire & Interactions ---
  const tryConnectWire = (compId, portId) => {
    if (!drawingWire) return;
    if (drawingWire.startCompId === compId && drawingWire.startPortId === portId) return;
    const newWire = {
      id: Date.now().toString(),
      startCompId: drawingWire.startCompId,
      startPortId: drawingWire.startPortId,
      endCompId: compId,
      endPortId: portId,
      showCurrent: false,
      isReverse: false,
    };
    const exists = wires.some(
      (w) =>
        (w.startCompId === newWire.startCompId &&
          w.endCompId === newWire.endCompId &&
          w.startPortId === newWire.startPortId &&
          w.endPortId === newWire.endPortId) ||
        (w.startCompId === newWire.endCompId &&
          w.endCompId === newWire.startCompId &&
          w.startPortId === newWire.endPortId &&
          w.endPortId === newWire.startPortId),
    );
    if (!exists) {
      setWires([...wires, newWire]);
    }
    setDrawingWire(null);
  };

  const handlePointerDown = (e) => {
    // Only handle if left click or touch
    if (e.button !== 0 && e.pointerType === "mouse") return;

    if (drawingWire && mode === "wire") {
      const newJointId = Date.now().toString();
      const newJoint = {
        id: newJointId,
        type: COMPONENT_TYPES.JOINT,
        x: drawingWire.currentX,
        y: drawingWire.currentY,
        rotation: 0,
      };
      setElements((prev) => [...prev, newJoint]);
      const newWire = {
        id: Date.now().toString() + "_seg",
        startCompId: drawingWire.startCompId,
        startPortId: drawingWire.startPortId,
        endCompId: newJointId,
        endPortId: "center",
      };
      setWires((prev) => [...prev, newWire]);
      setDrawingWire({
        startCompId: newJointId,
        startPortId: "center",
        startX: drawingWire.currentX,
        startY: drawingWire.currentY,
        currentX: drawingWire.currentX,
        currentY: drawingWire.currentY,
      });
      return;
    }
    if (!drawingWire) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      if (mode === "select") setSelectedId(null);
    }
  };

  const handleElementPointerDown = (e, id) => {
    e.stopPropagation();
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (drawingWire) return;
    if (mode === "delete") {
      setElements(elements.filter((el) => el.id !== id));
      setWires(wires.filter((w) => w.startCompId !== id && w.endCompId !== id));
      return;
    }
    if (mode === "select") {
      setSelectedId(id);
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleWirePointerDown = (e, id) => {
    e.stopPropagation();
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (drawingWire) return;
    if (mode === "delete") {
      setWires(wires.filter((w) => w.id !== id));
      return;
    }
    if (mode === "select") {
      setSelectedId(id);
    }
  };

  const handlePortPointerDown = (e, compId, portId) => {
    e.stopPropagation();
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (mode === "wire" || mode === "select") {
      if (drawingWire) {
        tryConnectWire(compId, portId);
      } else {
        const comp = elements.find((el) => el.id === compId);
        const config = COMPONENT_CONFIGS[comp.type];
        const portDef = config.ports.find((p) => p.id === portId);
        const absPos = getRotatedPortPosition(comp.x, comp.y, portDef, comp.rotation);
        setDrawingWire({
          startCompId: compId,
          startPortId: portId,
          startX: absPos.x,
          startY: absPos.y,
          currentX: absPos.x,
          currentY: absPos.y,
        });
      }
    }
  };

  const handlePortPointerUp = (e, compId, portId) => {
    e.stopPropagation();
    if (drawingWire) {
      tryConnectWire(compId, portId);
    }
  };

  // -- Styles ---
  const isBlueprint = theme === "blueprint";
  const componentColor = isBlueprint ? "white" : "black";
  const gridLineColor = isBlueprint ? "rgba(255,255,255,0.1)" : "#cbd5e1";
  const gridBgColor = "transparent";

  // Glow intense
  const glowStyle =
    isBlueprint && !isPhotoMode
      ? {
          filter:
            "drop-shadow(0 0 6px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 15px rgba(59, 130, 246, 0.6))",
        }
      : {};

  const selectedWire = useMemo(() => wires.find((w) => w.id === selectedId), [wires, selectedId]);
  const selectedComp = useMemo(
    () => elements.find((e) => e.id === selectedId),
    [elements, selectedId],
  );

  // Styles de l'UI - VERSION TOUCH (Larges surfaces)
  const panelBg = isBlueprint
    ? "bg-slate-800/95 border-slate-600 text-slate-200"
    : "bg-white/95 border-slate-200 text-slate-800";

  const itemBg = isBlueprint
    ? "bg-slate-700 active:bg-slate-600 border-slate-600"
    : "bg-slate-50 active:bg-slate-100 border-slate-200";

  const activeItemBg = isBlueprint
    ? "bg-blue-900/50 border-blue-400 text-blue-200"
    : "bg-blue-50 border-blue-400 text-blue-700";

  return (
    <div
      ref={containerRef}
      className={`relative h-screen font-sans overflow-hidden select-none touch-none ${isPhotoMode ? "bg-white" : isBlueprint ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"}`}
      onPointerMove={handleGlobalPointerMove}
      onPointerUp={handleGlobalPointerUp}
    >
      {/* Draggable Ghost - Follows finger/cursor during palette drag */}
      {newCompDrag && (
        <div
          className="fixed z-[100] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: newCompDrag.x, top: newCompDrag.y }}
        >
          <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400 backdrop-blur-sm shadow-2xl">
            <svg width="60" height="40" viewBox="-2.5 -2 5 4" style={{ overflow: "visible" }}>
              {COMPONENT_CONFIGS[newCompDrag.type].render(isBlueprint ? "white" : "black")}
            </svg>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full h-full relative">
        {/* INDICATEUR MODE CABLE (Nouveau) */}
        {mode === "wire" && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg backdrop-blur-sm text-sm font-bold flex items-center gap-2">
              <Plug size={16} />
              Mode Câble actif. Cliquez à nouveau sur Câble pour quitter.
            </div>
          </div>
        )}

        {/* COMPONENT PALETTE (Left Floating - Touch Optimized) */}
        {!isPhotoMode && (
          <div className="absolute top-28 left-6 z-40 w-[260px] flex flex-col gap-4 max-h-[calc(100vh-140px)] pointer-events-none">
            {/* Conteneur principal - Largeur augmentée */}
            <div
              className={`pointer-events-auto flex flex-col rounded-2xl shadow-xl border backdrop-blur-md overflow-hidden ${panelBg}`}
            >
              {/* Scrollable Area - touch-action: pan-y permet le scroll dans la palette */}
              <div
                className="overflow-y-auto no-scrollbar p-4"
                style={{ touchAction: "pan-y" }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-2 gap-3">
                  {/* Wire Button - Large Touch Target */}
                  <div
                    onPointerDown={(e) => {
                      setMode((prev) => (prev === "wire" ? "select" : "wire"));
                      setSelectedId(null);
                    }}
                    className={`flex flex-col items-center justify-center aspect-square p-3 rounded-xl transition-all cursor-pointer border shadow-sm active:scale-95 ${
                      mode === "wire" ? activeItemBg : itemBg
                    }`}
                  >
                    <div className={`mb-2 ${mode === "wire" ? "scale-110" : ""}`}>
                      <Plug size={32} />
                    </div>
                    <span className="text-xs font-bold tracking-wide text-center">Câble</span>
                  </div>

                  {Object.values(COMPONENT_TYPES)
                    .filter((t) => t !== COMPONENT_TYPES.JOINT)
                    .map((type) => {
                      const config = COMPONENT_CONFIGS[type];
                      return (
                        <div
                          key={type}
                          onPointerDown={(e) => handlePalettePointerDown(e, type)}
                          className={`flex flex-col items-center justify-center aspect-square p-3 rounded-xl transition-all cursor-grab active:cursor-grabbing border shadow-sm active:scale-95 group ${itemBg}`}
                        >
                          <div className="w-12 h-10 mb-2 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                            <svg
                              viewBox="-2.5 -2 5 4"
                              width="100%"
                              height="100%"
                              style={{ overflow: "visible" }}
                            >
                              {config.render(isBlueprint ? "#e2e8f0" : "#334155")}
                            </svg>
                          </div>
                          <span className="text-xs font-bold tracking-wide text-center truncate w-full">
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branding - Nodey */}
        <div className="absolute top-8 right-8 z-50 pointer-events-none">
          <h1
            className={`text-3xl font-bold tracking-tighter ${isBlueprint ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-slate-900"}`}
          >
            Nodey
          </h1>
        </div>

        {/* TOP MENU (Floating - Touch Optimized) */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4">
          {/* Mode Switcher - Larger Touch Targets */}
          <div
            className={`flex items-center p-1.5 rounded-full shadow-lg backdrop-blur-md border ${panelBg}`}
          >
            <button
              onClick={() => setTheme("light")}
              className={`px-6 py-3 rounded-full text-xs font-bold transition-all min-w-[80px] ${!isBlueprint ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              STANDARD
            </button>
            <button
              onClick={() => setTheme("blueprint")}
              className={`px-6 py-3 rounded-full text-xs font-bold transition-all min-w-[80px] ${isBlueprint ? "bg-slate-700 text-white shadow-sm ring-1 ring-slate-600" : "text-slate-500 hover:text-slate-800"}`}
            >
              DARK
            </button>
          </div>

          {/* Tools - Larger Touch Targets (Min 44px) */}
          <div
            className={`flex items-center gap-2 p-1.5 px-4 rounded-full shadow-lg backdrop-blur-md border ${panelBg}`}
          >
            <button
              onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
              className={`p-3 rounded-full transition-colors active:bg-black/10 ${isBlueprint ? "active:bg-white/10" : ""}`}
              title="Zoom Arrière"
            >
              <Minus size={20} />
            </button>

            <button
              onClick={() => {
                setScale(1);
                setPan({ x: 0, y: 0 });
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg active:bg-black/10 ${isBlueprint ? "active:bg-white/10" : ""}`}
              title="Réinitialiser vue"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              onClick={() => setScale((s) => Math.min(s + 0.1, 3))}
              className={`p-3 rounded-full transition-colors active:bg-black/10 ${isBlueprint ? "active:bg-white/10" : ""}`}
              title="Zoom Avant"
            >
              <Plus size={20} />
            </button>

            <div className={`w-px h-6 mx-2 ${isBlueprint ? "bg-slate-600" : "bg-slate-300"}`}></div>

            <button
              onClick={togglePhotoMode}
              className={`p-3 rounded-full transition-colors ${isPhotoMode ? "text-purple-500 bg-purple-100" : `active:bg-black/10 ${isBlueprint ? "active:bg-white/10" : ""}`}`}
              title={isPhotoMode ? "Quitter Mode Photo" : "Mode Photo"}
            >
              <Camera size={20} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          className={`w-full h-full ${isBlueprint && !isPhotoMode ? "bg-[#1e293b]" : "bg-slate-50"}`}
          style={
            isBlueprint && !isPhotoMode
              ? { background: "radial-gradient(circle at center, #1e3a8a 0%, #020617 100%)" }
              : {}
          }
        >
          <svg
            ref={svgRef}
            className="w-full h-full block touch-none"
            onPointerDown={handlePointerDown}
            // onPointerMove & Up are handled by global listener on container
            onContextMenu={(e) => {
              e.preventDefault();
              if (drawingWire) setDrawingWire(null);
            }}
          >
            <defs>
              <pattern
                id="grid"
                width={GRID_SIZE * scale}
                height={GRID_SIZE * scale}
                patternUnits="userSpaceOnUse"
              >
                {isBlueprint && !isPhotoMode && (
                  <rect width={GRID_SIZE * scale} height={GRID_SIZE * scale} fill={gridBgColor} />
                )}
                <path
                  d={`M ${GRID_SIZE * scale} 0 L 0 0 0 ${GRID_SIZE * scale}`}
                  fill="none"
                  stroke={isPhotoMode ? "#e2e8f0" : gridLineColor}
                  strokeWidth={isBlueprint ? 0.5 : 1}
                />
              </pattern>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
              {!isPhotoMode && (
                <rect x={-5000} y={-5000} width={10000} height={10000} fill="url(#grid)" />
              )}

              {/* Wires */}
              {wires.map((wire) => {
                const startComp = elements.find((e) => e.id === wire.startCompId);
                const endComp = elements.find((e) => e.id === wire.endCompId);

                if (!startComp || !endComp) return null;

                const startConfig = COMPONENT_CONFIGS[startComp.type];
                const endConfig = COMPONENT_CONFIGS[endComp.type];

                const startPortDef = startConfig.ports.find((p) => p.id === wire.startPortId);
                const endPortDef = endConfig.ports.find((p) => p.id === wire.endPortId);

                const startPos = getRotatedPortPosition(
                  startComp.x,
                  startComp.y,
                  startPortDef,
                  startComp.rotation,
                );
                const endPos = getRotatedPortPosition(
                  endComp.x,
                  endComp.y,
                  endPortDef,
                  endComp.rotation,
                );

                const isSelected = wire.id === selectedId;

                const dx = endPos.x - startPos.x;
                const dy = endPos.y - startPos.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const midX = (startPos.x + endPos.x) / 2;
                const midY = (startPos.y + endPos.y) / 2;
                let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                if (wire.isReverse) angle += 180;

                const arrowSpacing = 150;
                const numArrows = Math.max(1, Math.floor(length / arrowSpacing));
                const arrowPoints = [];
                for (let i = 1; i <= numArrows; i++) {
                  const t = i / (numArrows + 1);
                  arrowPoints.push({
                    x: startPos.x + dx * t,
                    y: startPos.y + dy * t,
                  });
                }

                return (
                  <g
                    key={wire.id}
                    onPointerDown={(e) => {
                      if (mode === "select" || mode === "delete") {
                        handleWirePointerDown(e, wire.id);
                      }
                    }}
                    className="cursor-pointer group"
                  >
                    <path
                      d={getWirePath(startPos.x, startPos.y, endPos.x, endPos.y)}
                      stroke="transparent"
                      strokeWidth={WIRE_THICKNESS * 6}
                      fill="none"
                    />
                    <path
                      d={getWirePath(startPos.x, startPos.y, endPos.x, endPos.y)}
                      stroke={
                        isSelected
                          ? isBlueprint
                            ? "#94a3b8"
                            : "#3b82f6"
                          : isPhotoMode
                            ? "black"
                            : componentColor
                      }
                      strokeWidth={WIRE_THICKNESS}
                      fill="none"
                      strokeLinecap="round"
                      style={glowStyle}
                      strokeDasharray={isSelected ? "5,2" : "none"}
                    />

                    {wire.showCurrent &&
                      arrowPoints.map((pt, idx) => (
                        <g key={idx} transform={`translate(${pt.x}, ${pt.y}) rotate(${angle})`}>
                          <path
                            d="M -8 -8 L 4 0 L -8 8 z"
                            fill={isBlueprint ? "#fbbf24" : "#ef4444"}
                            stroke="none"
                          />
                        </g>
                      ))}

                    {isSelected && !isPhotoMode && (
                      <foreignObject
                        x={midX - 75}
                        y={midY - 55}
                        width="150"
                        height="50"
                        style={{ overflow: "visible" }}
                      >
                        <div
                          className="flex items-center justify-center gap-2 bg-slate-800 p-2 rounded-full shadow-2xl transform -translate-x-0 border border-slate-600"
                          style={{ pointerEvents: "auto" }}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <button
                            className={`p-2 rounded-full active:bg-white/10 transition-colors ${wire.showCurrent ? "text-green-400" : "text-slate-300"}`}
                            title="Afficher/Masquer courant"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCurrentOnSelection();
                            }}
                          >
                            <Activity size={18} />
                          </button>

                          {wire.showCurrent && (
                            <>
                              <button
                                className="p-2 rounded-full text-slate-300 active:bg-white/10 transition-colors relative"
                                title="Inverser Sens"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  flipCurrentOnSelection();
                                }}
                              >
                                <ArrowRightLeft size={18} />
                              </button>
                            </>
                          )}

                          <div className="w-px h-6 bg-slate-600 mx-1"></div>

                          <button
                            className="p-2 rounded-full text-red-400 active:bg-white/10 transition-colors"
                            title="Supprimer"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSelection();
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}

              {nodePoints.map((node, i) => (
                <circle
                  key={i}
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill={isPhotoMode ? "black" : componentColor}
                />
              ))}

              {drawingWire && (
                <g>
                  <path
                    d={getWirePath(
                      drawingWire.startX,
                      drawingWire.startY,
                      drawingWire.currentX,
                      drawingWire.currentY,
                    )}
                    stroke="#3b82f6"
                    strokeWidth={WIRE_THICKNESS}
                    strokeDasharray="5,5"
                    fill="none"
                  />
                  <circle
                    cx={drawingWire.currentX}
                    cy={drawingWire.currentY}
                    r="3"
                    fill="#ef4444"
                  />
                </g>
              )}

              {elements.map((el) => {
                const config = COMPONENT_CONFIGS[el.type];
                const isSelected = el.id === selectedId;

                return (
                  <g
                    key={el.id}
                    transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation})`}
                    onPointerDown={(e) => handleElementPointerDown(e, el.id)}
                    className="cursor-pointer"
                  >
                    {/* Double Tap simulation could be added here if needed, keeping simple click for now */}

                    {el.type !== COMPONENT_TYPES.JOINT && (
                      <rect
                        x={-(config.width * GRID_SIZE) / 2}
                        y={-(config.height * GRID_SIZE) / 2}
                        width={config.width * GRID_SIZE}
                        height={config.height * GRID_SIZE}
                        fill="transparent"
                        stroke="none"
                      />
                    )}

                    {isSelected && !isPhotoMode && el.type !== COMPONENT_TYPES.JOINT && (
                      <g>
                        <rect
                          x={-(config.width * GRID_SIZE) / 2 - 8}
                          y={-(config.height * GRID_SIZE) / 2 - 8}
                          width={config.width * GRID_SIZE + 16}
                          height={config.height * GRID_SIZE + 16}
                          fill="none"
                          stroke={isBlueprint ? "#94a3b8" : "#3b82f6"}
                          strokeDasharray="4,4"
                          strokeWidth="1.5"
                          rx="6"
                        />

                        {/* Large touch targets for controls */}
                        <g
                          transform={`translate(-16, ${-(config.height * GRID_SIZE) / 2 - 24})`}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setElements(
                              elements.map((item) =>
                                item.id === el.id
                                  ? { ...item, rotation: (item.rotation + 90) % 360 }
                                  : item,
                              ),
                            );
                          }}
                          className="active:opacity-80 transition-opacity"
                        >
                          <circle
                            r="14"
                            fill={isBlueprint ? "#1e293b" : "white"}
                            stroke={isBlueprint ? "#94a3b8" : "#3b82f6"}
                            strokeWidth="1.5"
                          />
                          <RotateCw
                            size={16}
                            x={-8}
                            y={-8}
                            className={isBlueprint ? "text-slate-300" : "text-blue-600"}
                          />
                        </g>

                        <g
                          transform={`translate(16, ${-(config.height * GRID_SIZE) / 2 - 24})`}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            deleteSelection();
                          }}
                          className="active:opacity-80 transition-opacity"
                        >
                          <circle
                            r="14"
                            fill={isBlueprint ? "#1e293b" : "white"}
                            stroke={isBlueprint ? "#f87171" : "#ef4444"}
                            strokeWidth="1.5"
                          />
                          <Trash2
                            size={16}
                            x={-8}
                            y={-8}
                            className={isBlueprint ? "text-red-400" : "text-red-600"}
                          />
                        </g>
                      </g>
                    )}

                    <g transform={`scale(${GRID_SIZE})`} style={glowStyle}>
                      {config.render(
                        isSelected && !isPhotoMode && !isBlueprint
                          ? "#1d4ed8"
                          : isPhotoMode
                            ? "black"
                            : componentColor,
                      )}
                    </g>

                    {(mode === "wire" || isSelected || drawingWire) &&
                      !isPhotoMode &&
                      config.ports.map((port) => (
                        <circle
                          key={port.id}
                          cx={port.x * GRID_SIZE}
                          cy={port.y * GRID_SIZE}
                          r={mode === "wire" ? 12 : 6} // Larger hit area for wire connection
                          fill={mode === "wire" ? "#ef4444" : "transparent"}
                          stroke={mode === "wire" ? "white" : "transparent"}
                          strokeWidth="1.5"
                          className="active:fill-red-600 transition-all"
                          onPointerDown={(e) => handlePortPointerDown(e, el.id, port.id)}
                          onPointerUp={(e) => handlePortPointerUp(e, el.id, port.id)}
                        />
                      ))}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
