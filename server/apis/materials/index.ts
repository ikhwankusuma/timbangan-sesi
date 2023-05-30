import { Router } from "express";

import { materialGetController } from "../../controllers/materials/get/index";
import { materialPostController } from "../../controllers/materials/post";
import { materialPutController } from "../../controllers/materials/put";

const router: Router = Router()

router.get('/', materialGetController)
router.post('/', materialPostController)
router.put('/:_id', materialPutController)

export default router