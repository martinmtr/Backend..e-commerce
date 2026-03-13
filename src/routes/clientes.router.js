import express from "express"
import { forgotPassword, resetPassword } from '../controllers/user.controller.js';
export const router=express.Router()

router.get("/", (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"clientes"});
})


router.get("/codigo/:id", (req, res)=>{

    let {id}=req.params

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:`Listando cliente id ${id}`});
})
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
export default router;