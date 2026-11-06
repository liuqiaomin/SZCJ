<template>
    <div>
        <!-- <iframe src="https://example.com" width="100%" height="500px"></iframe> -->
        <el-card>
            <h1>版本更新</h1>
            <h3>
                <el-row :gutter="2" class="fdr">
                    <el-col>
                        6, 2025-22-17 小程序订单退单页 修复订单退单 退款问题
                    </el-col>
                    <el-col>
                        5, 2024-12-27 商品管理 增加 昨日库存 凌晨00点 同步
                    </el-col>
                    <el-col>
                        4, 2024-12-27 库存管理 增加 线下开单预先列表 小程序开单预先列表
                    </el-col>
                    <el-col>
                        3, 2024-12-27 待抢单 增加派单功能
                    </el-col>
                    <el-col>
                        2, 2024-12-27 订单详情 增加编码是否显示开关
                    </el-col>
                    <el-col>
                        1, 2024-12-27 小程序订单退单页 修复线下订单退单也显示这里
                    </el-col>
                </el-row>
            </h3>
        </el-card>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
@import "@/styles/variables.module.scss";
</style>
