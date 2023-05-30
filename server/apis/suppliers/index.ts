import { Router } from "express";

import { supplierGetController } from "../../controllers/suppliers/get/index";
import { supplierPostController } from "../../controllers/suppliers/post";
import { supplierPutController } from "../../controllers/suppliers/put";

const router: Router = Router()

router.get('/', supplierGetController)
router.post('/', supplierPostController)
router.put('/:_id', supplierPutController)

export default router