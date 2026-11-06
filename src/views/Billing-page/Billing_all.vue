<template>
    <div class="home-box">
        <el-card>
            <el-form :inline="true" :model="searchForm" v-show="showSearch">
                <el-form-item label="搜索类型" prop="Regional_barcode ">
                    <el-select v-model="searchForm.field" clearable placeholder="选择搜索类型">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索的内容" v-if="searchForm.field">
                    <el-input v-model="searchForm.content" placeholder="请输入要搜索的内容" class="handle-input mr10"
                        clearable></el-input>
                </el-form-item>
                <el-form-item label="搜索时间" prop="Search_Date_time">
                    <el-date-picker v-model="searchForm.Search_Date_time" type="datetimerange" :shortcuts="shortcuts"
                        format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="remoteMethod" style="margin-left: -16px">查询搜索
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="czz">
                        <el-icon>
                            <HelpFilled />
                        </el-icon>重置
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-table :data="tableData" show-summary v-loading="loading" element-loading-text="加载中..." border>
                <el-table-column prop="id" label="订单iD" align="center" width="90">
                </el-table-column>
                <el-table-column prop="created_by" label="开单人" align="center" width="180">
                </el-table-column>

                <el-table-column prop="customer_name" label="客户名" align="center" width="200">
                </el-table-column>

                <el-table-column prop="order_total_price" label="订单总价" align="center" width="120">
                </el-table-column>

                <el-table-column prop="created_time" label="开单时间" align="center" width="180">
                </el-table-column>
                <el-table-column prop="customer_address" label="客户地址" align="center" width="300">
                </el-table-column>
                <el-table-column prop="customer_phone" label="客户电话" align="center" width="130">
                </el-table-column>
                <el-table-column label="订单状态" align="center" width="100">
                    <template #default="{ row }">
                        {{ row.state == 0 ? '待审核出库' :
                            row.state == 1 ? '已出库 待分配' :
                                row.state == 2 ? '配送中' :
                                    row.state == 3 ? '已完成' :
                                        row.state == 5 ? '退货中' :
                                            row.state == 6 ? '退单申请中' :
                                                row.state == 7 ? '已取消' :
                                                    '待分配' }}
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" align="center" width="150">
                    <template #default="{ row }">
                        {{ row.XY == 1 ? '小程序订单' : row.XY == 0 ? '后台线下订单' : row.XY == 2 ? '手机端下单' : '小程序预售' }}
                    </template>
                </el-table-column>
                <el-table-column prop="customer_level" label="客户等级" align="center" width="120">
                </el-table-column>
                <el-table-column label="配送类型" align="center" width="100">
                    <template #default="{ row }">
                        {{ row.mode == 0 ? '配送' : '自提' }}
                    </template>
                </el-table-column>
                <el-table-column prop="print_id" label="打印次数" align="center" width="120">
                </el-table-column>
                <el-table-column prop="delivery_person" label="配送员" align="center" width="180">
                </el-table-column>

                <el-table-column label="交付图" align="center" width="95">
                    <template #default="{ row }">
                        <el-image class="avatar" :src="row.receipt_photo" :z-index="10"
                            :preview-src-list="[row.receipt_photo]" preview-teleported>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="168" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" plain @click="onShowClick(row)">查看</el-button>
                        <el-button v-if="row.print_id == 0" type="primary" plain @click="API_PHP_DEMObu(row)">
                            打印
                        </el-button>
                        <el-button v-else plain @click="API_PHP_DEMObu(row)"> 打印 </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page"
                v-model:limit="searchForm.page_size" @pagination="getListData" />
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { api, API_PHP_DEMO } from "@/api/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { switchServerUrl } from "@/utils/index";

const store = useStore();
const router = useRouter();

const showSearch = ref(true);

const Search_Date_time = ref('')

const shortcuts = [
    {
        text: '最近一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 7)
            return [start, end]
        },
    },
    {
        text: '最近一个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            return [start, end]
        },
    },
    {
        text: '最近三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 3)
            return [start, end]
        },
    },
]

//数据源
const searchForm = ref({
    id: 0,
    Regional_barcode: "",
    row: "",
    role: "",
    date: "",
    page: 1,
    page_size: 10,


    Search_Date_time: '',
    field: "", //搜索字段
    content: "", //搜索内容
    content2: "", //搜索内容
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
    getListData();
});
// watch(
//   () => router.currentRoute.value,
//   () => {
//     getListData();
//   }
// );
/**
 * 获取商品列表
 */
const getListData = async () => {

    if (searchForm.value.field) {
        console.log('调用搜索')
        remoteMethod();
        return
    }
    loading.value = true;
    let in_data = {
        Type: "get",
        Table: "order_list",
        page: searchForm.value.page,
        page_size: searchForm.value.page_size,
    };
    await api(in_data)
        .then((res) => {
            console.log(res);
            if (res.status.error_msg == "success") {
                tableData.value = res.bizobj;
                total.value = Number(res.page_info.total_items);
                setTimeout(() => {
                    loading.value = false;
                }, 1000);
            } else {
                ElMessage.error("查询失败！");
            }
            loading.value = false;
        })
        .catch((err) => {
            loading.value = false;
        });
};

const czz = () => {
    searchForm.value.page = 1;
    searchForm.value.page_size = 10;
    searchForm.value.Search_Date_time = '';
    searchForm.value.field = ""; //搜索字段
    searchForm.value.content = ""; //搜索内容
    searchForm.value.content2 = ""; //搜索内容
    getListData();
};
/**
 * 查看按钮点击事件
 */
const onShowClick = (row) => {
    let i = {
        id: row.id,
    };
    router.push({
        path: "/Billing/Billing_xq",
        query: i,
    });
};
const API_PHP_DEMObu = async (row) => {
    console.log(row);

    let in_data = {
        id: row.id,
    };
    await API_PHP_DEMO(in_data)
        .then((res) => {
            console.log(res);
            if (res.status.error_msg == "success") {
                ElMessage.success("发起打印成功");
            } else {
                ElMessage.error("发起打印失败！");
            }
        })
        .catch((err) => { });
};

// 查询操作
const options = [
    {
        value: "id",
        label: "订单ID",
    },
    {
        value: "customer_name",
        label: "客户名",
    },

    {
        value: "customer_phone",
        label: "客户电话",
    },
    {
        value: "created_by",
        label: "开单人",
    },
    {
        value: "delivery_person",
        label: "配送员",
    },
];
const remoteMethod = async () => {
    if (searchForm.value.field) {
        loading.value = true;
        tableData.value = [];
        let in_data = {
            Type: "Search_Date",
            Table: "order_list",
            condition_name1: searchForm.value.field,
            condition1: searchForm.value.content,
            Search_Date_time: JSON.stringify(searchForm.value.Search_Date_time),
            page: searchForm.value.page,
            page_size: searchForm.value.page_size
        };
        await api(in_data)
            .then((res) => {
                loading.value = false;
                if (res.status.error_msg == "success") {
                    tableData.value = res.bizobj;
                    total.value = res.count;
                } else {
                    ElMessage.error("无数据！");
                }
            })
            .catch((err) => {
                loading.value = false;
            });
    }
};
</script>

<style lang="scss" scoped>
.home-box {
    .header {
        margin-bottom: 22px;
        text-align: right;
    }

    ::v-deep .el-tag {
        margin-right: 6px;
    }

    ::v-deep .avatar {
        width: 60px;
        height: 60px;
        border-radius: 13%;
    }
}
</style>
