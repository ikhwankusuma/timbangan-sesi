import { Router } from "express";

import { userPostController } from "../../controllers/users/post";
import { userPostLoginController } from "../../controllers/users/post-login";
import { userPostRefreshController } from "../../controllers/users/post-refresh";
import { userPutController } from "../../controllers/users/put";

const router: Router = Router()

router.post('/', userPostController)
router.post('/login', userPostLoginController)
router.post('/refresh', userPostRefreshController)
router.put('/:_id', userPutController)

export default router