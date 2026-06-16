import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/ui/Modal';
import { FriendForm } from '../components/friend/FriendForm';

export function AddFriendPage() {
  const navigate = useNavigate();

  return (
    <Modal open={true} onClose={() => navigate('/friends')} title="新增朋友">
      <FriendForm onClose={() => navigate('/friends')} />
    </Modal>
  );
}
