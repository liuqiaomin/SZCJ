<template>
  <div class="diva">
    <div class="container">
      <el-form label-position="right" label-width="100px" :model="form" size="large">
        <el-form-item label="商品名" prop="name" label-width="100">
          <el-input v-model="form.product_name"></el-input>
        </el-form-item>
        <el-form-item label="商品条码" prop="name" label-width="100">
          <el-input v-model="form.Regional_barcode"></el-input>
        </el-form-item>
        <el-form-item label="商品排序" prop="Sort" label-width="100">
          <el-input v-model="form.Sort" placeholder="值越小排名越高" p></el-input>
        </el-form-item>
        <el-form-item label="商品状态" prop="product_status">
          <el-switch v-model="form.product_status" inline-prompt active-text="上架" inactive-text="下架" />
        </el-form-item>
        <el-form-item label="主图" prop="form.main_image">
          <el-image style="width: 100px; height: 100px" :src="form.main_image" :v-if="form.main_image" />
          <el-upload class="upload-demo" drag action="https://xcx.szhxch.com/i.php" multiple :on-change="img_handle">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将jpg/png/webp图片拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="多图" prop="form.multi_images">
          <el-upload action="https://xcx.szhxch.com/i.php" list-type="picture-card"
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="img_handle2"
            :file-list="form.fileList" multiple>
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>

          <el-dialog>
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="规格" prop="specification" label-width="100">
          <el-input v-model="form.specification"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="specification_quantity">
          <el-input v-model="form.specification_quantity"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input disabled v-model="form.stock"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品分类" prop="category">
          <el-radio-group v-model="form.category">
            <el-radio label="商超卖点"></el-radio>
            <el-radio label="环保降解类"></el-radio>
            <el-radio label="纸巾系列"></el-radio>
            <el-radio label="竹木系列"></el-radio>
            <el-radio label="环保方形"></el-radio>
            <el-radio label="环保圆形"></el-radio>
            <el-radio label="环保袋系列"></el-radio>
            <el-radio label="清洁用品"></el-radio>
            <el-radio label="套装类"></el-radio>
            <el-radio label="发泡系列"></el-radio>
            <el-radio label="锡铝系列"></el-radio>
            <el-radio label="其它"></el-radio>
            <el-radio label="杯类"></el-radio>
            <el-radio label="水杯类"></el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="商品分类" prop="category">
          <el-radio-group v-model="form.category">
            <!-- 使用v-for遍历商品分类 -->
            <el-radio v-for="(item, index) in tableData" :key="index" :label="item.category_name"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单价" prop="unit_price" label-width="100">
          <el-input v-model="form.unit_price"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="Purchase_price" label-width="100">
          <el-input v-model="form.Purchase_price"></el-input>
        </el-form-item>
        <el-form-item label="一级零售" prop="retail_price" label-width="200">
          <el-input v-model="form.retail_price"></el-input>
        </el-form-item>
        <el-form-item label="二级餐厅/百货" prop="grocery_price" label-width="200">
          <el-input v-model="form.grocery_price"></el-input>
        </el-form-item>
        <el-form-item label="三级粮油-商超" prop="department_store_price" label-width="200">
          <el-input v-model="form.department_store_price"></el-input>
        </el-form-item>
        <el-form-item label="四级内部优惠" prop="wholesale_price" label-width="200">
          <el-input v-model="form.wholesale_price"></el-input>
        </el-form-item>
        <el-form-item label="按件数设置价格" label-width="150" v-for="(item, index) in form.full_list" :key="index">
          <el-row :gutter="20">
            <el-col :span="12">
              <div />
              <el-form-item label="满多少件">
                <el-input v-model="item.a"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div />
              <el-form-item label="单价为多少">
                <el-input v-model="item.b"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="营销开关" prop="marketingXY">
          <el-switch v-model="form.marketingXY" inline-prompt active-text="开" inactive-text="关" />
        </el-form-item>
        <el-form-item label="营销文字" prop="marketing" label-width="100">
          <el-input v-model="form.marketing"></el-input>
        </el-form-item>
        <el-form-item label="商品详情">
          <div class="mgb20" ref="editor"></div>
          <!-- <el-button type="primary" @click="syncHTML">提交</el-button> -->
        </el-form-item>
        <el-row class="mb-1">
          <el-button type="primary" @click="adds()">保存</el-button>
        </el-row>
      </el-form>
      <el-dialog v-model="dialogVisible" label-width="100%">
        <img :src="dialogImageUrl" style="width: 600px;height: 500px; ">
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { api } from "@/api/api";
import { ref, onMounted, onBeforeUnmount, watch, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
//富文本编辑器
import WangEditor from "wangeditor";
const editor = ref(null);
const content = reactive({
  html: "",
  text: "",
});
let instance = [];
onMounted(() => {
  query();
  instance = new WangEditor(editor.value);
  instance.config.zIndex = 1;
  instance.create();
  getListData();
});
onBeforeUnmount(() => {
  instance.destroy();
  instance = null;
});
// 监听路由变化时触发
watch(
  () => route.query.id,
  () => {

    query();
  }
);
const syncHTML = () => {
  content.html = instance.txt.html();
  form.fwb = content.html;
};

console.log(route.query.id);
/**
 * 获取商品列表
 */
const query = async () => {
  if (route.query.id) {
    let in_data = {
      Type: "id_get",
      Table: "products",
      id: route.query.id,
    };
    await api(in_data)
      .then((res) => {
        if (res.status.error_msg == "success") {
          let o = res.bizobj;
          form.id = o.id;
          form.product_name = o.product_name;
          form.Regional_barcode = o.Regional_barcode;
          form.main_image = o.main_image;
          form.fileList = JSON.parse(o.multi_images);
          form.specification = o.specification;
          form.specification_quantity = o.specification_quantity;
          form.stock = o.stock;
          form.category = o.category;
          form.unit_price = o.unit_price;
          form.retail_price = o.retail_price;
          form.grocery_price = o.grocery_price;
          form.department_store_price = o.department_store_price;
          form.wholesale_price = o.wholesale_price;
          form.full_list = JSON.parse(o.full_list2);
          form.Sort = o.Sort;
          form.Purchase_price = o.Purchase_price;
          form.marketing = o.marketing;
          instance.txt.html(o.fwb);
          form.product_status = parseInt(o.product_status) === 1 ? true : false;
          form.marketingXY = parseInt(o.marketingXY) === 1 ? true : false;
          console.log(form);
        } else {
          ElMessage.error("查询失败！");
        }
      })
      .catch((err) => { });
  }
};
const form = reactive({
  Type: "products_up",
  Table: "products",
  id: "",
  product_name: "",
  Regional_barcode: "",
  product_status: true,
  main_image: "",
  multi_images: "",
  specification: "",
  specification_quantity: "",
  stock: "",
  category: "",
  unit_price: "",
  Purchase_price: "",
  retail_price: "",
  grocery_price: "",
  department_store_price: "",
  wholesale_price: "",
  full_list: [
    {
      a: "",
      b: "",
    },
    {
      a: "",
      b: "",
    },
    {
      a: "",
      b: "",
    },
  ],
  fileList: [],
  marketingXY: 0,
  marketing: ''
});
//上传主图
const img_handle = (rawFile) => {
  console.log(rawFile);
  if (
    rawFile.raw.type == "image/jpeg" ||
    rawFile.raw.type == "image/png" ||
    rawFile.raw.type == "image/webp"
  ) {
    form.main_image = rawFile.response;
  } else {
    ElMessage.error("请上传jpg或png/webp图片！");
    z;
  }
};
//上传多图
const img_handle2 = (rawFile) => {
  console.log(rawFile);
  let i = {
    url: rawFile,
  };
  form.fileList.push(i);
};
const handleRemove = (file, fileList) => {
  console.log(file, fileList);
  form.fileList = fileList
};

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handlePictureCardPreview = (file) => {
  dialogVisible.value = true;
  dialogImageUrl.value = file.url;
};
/**
 * 提交
 */
const adds = async () => {
  syncHTML();
  form.full_list2 = JSON.stringify(form.full_list);
  form.oo = JSON.stringify(form.fileList);
  await api(form)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("更新成功");
        router.push({
          path: "/Product/Product_List",
          // query: row,
        });
      } else {
        ElMessage.error("更新失败！");
      }
    })
    .catch((err) => { });
};
/**
 * 获取分类列表
 */

const tableData = ref([]);
const loading = ref(false);
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
    page_size: 1000,
  };
  await api(in_data).then((res) => {

    if (res.status.error_msg == "success") {
      tableData.value = res.bizobj;
    } else {
      ElMessage.error("分类查询失败！");
    }
  });
};
</script>

<style lang="scss" scoped>
.diva {
  padding: 50px 200px 10px 200px;
  background-color: #ffffff;
  border-radius: 14px;
  boxshadow: var(--el-box-shadow);
}
</style>
