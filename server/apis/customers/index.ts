import { Router } from "express";

import { customerGetController } from "../../controllers/customers/get/index";
import { customerPostController } from "../../controllers/customers/post";
import { customerPutController } from "../../controllers/customers/put";

const router: Router = Router()

router.get('/', customerGetController)
router.post('/', customerPostController)
router.put('/:_id', customerPutController)

export default router