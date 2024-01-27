import Modal from "@/components/Modal";
import { useProjectStore } from "@/stores/projectStore";

export default function AIInsightModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const aiInsightModal = useProjectStore((state) => state.aiInsightModal);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        <h2 className="text-4xl font-semibold">AI Insight</h2>
        <div>{aiInsightModal?.logId}</div>
      </div>
    </Modal>
  );
}
