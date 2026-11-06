<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item>
        <el-button type="warning" @click="add_dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="category_name" label="分类名" align="center" width="120">
        </el-table-column>
        <el-table-column label="分类图" align="center" width="95">
          <template #default="{ row }">
            <el-image
              class="avatar"
              :src="row.image"
              :z-index="10"
              :preview-src-list="[row.image]"
              preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="分类排序" align="center" width="95">
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" align="center" width="180">
        </el-table-column>
        <el-table-column label="操作" width="178" align="center" fixed="right">
          <template #default="{ row }">
            <el-button plain @click="upClick(row)">编辑</el-button>
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增 -->
      <el-dialog v-model="add_dialogVisible" title="新增" width="30%">
        <el-form-item label="分类名" prop="category_name">
          <el-input
            v-model="searchForm.category_name"
            placeholder="请输入分类名"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类图" prop="form.image">
          <el-upload
            class="upload-demo"
            drag
            action="https://xcx.szhxch.com/i.php"
            multiple
            :on-change="img_handle"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将jpg/png/webp图片拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类排序" prop="type">
          <el-input
            v-model="searchForm.sort_order"
            placeholder="值越小排名越高"
          ></el-input>
        </el-form-item>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="add_dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="add">新建 </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 编辑 -->
      <el-dialog v-model="up_dialogVisible" title="更新" width="30%">
        <el-form-item label="分类名" prop="category_name">
          <el-input
            v-model="searchForm.category_name"
            placeholder="请输入分类名"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类图" prop="form.image">
          <el-upload
            class="upload-demo"
            drag
            action="https://xcx.szhxch.com/i.php"
            multiple
            :on-change="img_handle"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将jpg/png/webp图片拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类排序" prop="type">
          <el-input
            v-model="searchForm.sort_order"
            placeholder="值越小排名越高"
          ></el-input>
        </el-form-item>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="up_dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="up">保存更新 </el-button>
          </span>
        </template>
      </el-dialog>
      <!--分页组件-->
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="searchForm.page"
        v-model:limit="searchForm.page_size"
        @pagination="getListData"
      />
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { api } from "@/api/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { switchServerUrl } from "@/utils/index";

const store = useStore();
const router = useRouter();

const showSearch = ref(true);

//数据源
const searchForm = ref({
  id: 0,
  category_name: "",
  sort_order: "",
  image: "",
  page: 1,
  page_size: 10,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

//重置
const resetting = async () => {
  searchForm.value = {
    id: 0,
    category_name: "",
    sort_order: 0,
    image: "",
    page: 1,
    page_size: 10,
  };
};
onMounted(() => {
  getListData();
});
/**
 * 获取客户列表
 */
const getListData = async () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
  let in_data = {
    Type: "get",
    Table: "ProductCategory",
    ORDER_nane: "sort_order",
    ORDER_da: "ASC",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
  };
  await api(in_data).then((res) => {
    console.log(res);
    if (res.status.error_msg == "success") {
      tableData.value = res.bizobj;
      total.value = Number(res.page_info.total_items);
    } else {
      ElMessage.error("查询失败！");
    }
  });
};
//上传图
const img_handle = (rawFile) => {
  console.log(rawFile);
  if (
    rawFile.raw.type == "image/jpeg" ||
    rawFile.raw.type == "image/png" ||
    rawFile.raw.type == "image/webp"
  ) {
    form.image = rawFile.response;
  } else {
    ElMessage.error("请上传jpg或png/webp图片！");
  }
};
//新增客户
const add_dialogVisible = ref(false);
const add = async () => {
  let ii = searchForm.value;
  const in_data = {
    Type: "ProductCategory_add",
    Table: "ProductCategory",
    category_name: ii.category_name,
    sort_order: ii.sort_order,
    image: ii.image,
  };

  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("新建成功");
        add_dialogVisible.value = false;
        getListData();
        resetting();
      } else {
        ElMessage.error("新建失败！");
      }
    })
    .catch((err) => {});
};

//编辑客户
const up_dialogVisible = ref(false);
const upClick = async (row) => {
  up_dialogVisible.value = true;
  console.log(row);
  searchForm.value.id = row.id;
  searchForm.value.category_name = row.category_name;
  searchForm.value.sort_order = row.sort_order;
  searchForm.value.image = row.image;
};
const up = async () => {
  let ii = searchForm.value;
  const in_data = {
    Type: "ProductCategory_up",
    Table: "ProductCategory",
    id: ii.id,
    category_name: ii.category_name,
    sort_order: ii.sort_order,
    image: ii.image,
  };

  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("更新成功");
        up_dialogVisible.value = false;
        getListData();
        resetting();
      } else {
        ElMessage.error("更新失败！");
      }
    })
    .catch((err) => {});
};
/**
 * 删除按钮点击事件
 */
const onRemoveClick = async (row) => {
  const confirmResult = await ElMessageBox.confirm(
    "确定要删除【" + row.category_name + "】这个客户吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    const requestData = {
      id: row.id,
      Table: "ProductCategory",
      Type: "delete",
    };
    try {
      const response = await api(requestData);
      console.log(response);
      if (response.status.error_msg === "success") {
        ElMessage.success("删除成功");
        getListData();
      } else {
        ElMessage.error("删除失败！");
      }
    } catch (error) {
      console.error(error);
    }
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
