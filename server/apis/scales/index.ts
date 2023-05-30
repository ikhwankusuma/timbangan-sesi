import { Router } from "express";

import { scalePostController } from "../../controllers/scales/post";
import { scalePutAddController } from "../../controllers/scales/put-add";
import { scaletGetDataController } from "../../controllers/scales/get-data";
import { scaleGetController } from "../../controllers/scales/get";
import { scalePutRemoveController } from "../../controllers/scales/put-remove";
import { scalePutFinishController } from "../../controllers/scales/put-finish";

const router: Router = Router()

router.post('/', scalePostController)
router.put('/add/:scale_id', scalePutAddController)
router.put('/finish/:scale_id', scalePutFinishController)
router.put('/remove/:scale_id/:data_id', scalePutRemoveController)
router.get('/data', scaletGetDataController)
router.get('/', scaleGetController)

export default router