import { createContext, useContext, useState } from "react";

import type { ReactNode } from "react";

interface LeaveModalContextType {
  isLeaveModalOpen: boolean;
  openLeaveModal: () => void;
  closeLeaveModal: () => void;
  isCurrentFormDirty: boolean;
  setIsCurrectFormDirty: (isCurrentFormDirty: boolean) => void;
  isLeavingContent: boolean;
  setIsLeavingContent: (isLeavingContent: boolean) => void;
}

const LeaveModalContext = createContext<LeaveModalContextType | undefined>(undefined);

export const useLeaveModal = (): LeaveModalContextType => {
  const context = useContext(LeaveModalContext);
  if (!context) {
    throw new Error("useLeaveModal must be used within a LeaveModalProvider");
  }
  return context;
};

interface LeaveModalProviderProps {
  children: ReactNode;
}

export const LeaveModalProvider = ({ children }: LeaveModalProviderProps) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [isCurrentFormDirty, setIsCurrectFormDirty] = useState(false);
  const [isLeavingContent, setIsLeavingContent] = useState(false);

  const openLeaveModal = () => setIsLeaveModalOpen(true);
  const closeLeaveModal = () => setIsLeaveModalOpen(false);

  return (
    <LeaveModalContext.Provider
      value={{
        isLeaveModalOpen,
        openLeaveModal,
        closeLeaveModal,
        isCurrentFormDirty,
        setIsCurrectFormDirty,
        isLeavingContent,
        setIsLeavingContent,
      }}
    >
      {children}
    </LeaveModalContext.Provider>
  );
};
