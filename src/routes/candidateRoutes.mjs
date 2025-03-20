import express from "express";
import { registerCandidate ,updateCandidate,deleteCandidate,voteCandidate,countVoteCandidate,getCandidateList} from "../controllers/candidateController.mjs";
import { jwtAuthMiddleWare } from "../utils/generateToken.mjs";
const router = express.Router();

router.post('/signup',jwtAuthMiddleWare,registerCandidate);
router.put('/:candidateId',jwtAuthMiddleWare,updateCandidate);
router.delete('/:candidateId',jwtAuthMiddleWare,deleteCandidate);
router.post('/vote/:candidateId',jwtAuthMiddleWare,voteCandidate);
router.get('/vote/count',countVoteCandidate);
router.get('/candidate',getCandidateList);

export default router;