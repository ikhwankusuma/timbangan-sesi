import { Router } from "express";

import { sourceGetController } from "../../controllers/sources/get/index";
import { sourcePostController } from "../../controllers/sources/post/index";

const router: Router = Router()

router.get('/', sourceGetController)
router.post('/', sourcePostController)

export default router