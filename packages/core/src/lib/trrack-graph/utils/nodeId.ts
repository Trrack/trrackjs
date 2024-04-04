import { uuid } from '../../utils/uuid';
import { NodeId } from '../nodes';

export function getNodeId(): NodeId {
  return uuid();
}
