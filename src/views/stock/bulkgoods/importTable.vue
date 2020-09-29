<template>
  <el-dialog :title="title" :visible.sync="visible"  width="1500px">
    <el-table v-loading="loading" :data="flowList"   >
      <el-table-column label="品名" align="center" prop="name" />
       <el-table-column label="车牌号" align="center" prop="veLicenseNo" />
      <el-table-column label="入/出库时间" align="center" prop="optime" />
      <el-table-column label="入/出库重量" align="center" prop="weight" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
import {
  flowList,
} from "@/api/stock/info";

export default {
  name: "Info",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示
      visible:false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 库存信息表格数据
      flowList: [],
       // 统计单位列表
       periodOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      updateDialog: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseId:undefined,
        warehouseId:undefined,
        optime:undefined,
        direction:undefined,
        period:undefined
      },
      // 表单参数
      form: {

      },
    };
  },
  methods: {
    show() {
    this.getList();
  },
    /** 查询库存流水表 */
    getList() {
      flowList(this.queryParams).then(response => {
        this.flowList = response.rows; 
        this.total=response.total
      });
       this.loading=false
    },
   
  }
};
</script>


