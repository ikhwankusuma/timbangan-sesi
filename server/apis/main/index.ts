import { Router } from "express";

import { mainPostConfigController } from "../../controllers/main/post-config";
import { mainPutConfigController } from "../../controllers/main/put-config";
import { mainGetConfigController } from "../../controllers/main/get-config";
import { mainGetController } from "../../controllers/main/get";

const router: Router = Router()

router.post('/config', mainPostConfigController)
router.put('/config', mainPutConfigController)
router.get('/config', mainGetConfigController)
router.get('/', mainGetController)

export default router