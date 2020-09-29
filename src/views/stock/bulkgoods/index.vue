<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="进出日期" prop="optime">
       <el-date-picker
      v-model="queryParams.optime"
      align="right"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期"
      :picker-options="pickerOptions">
    </el-date-picker>
      </el-form-item>
      <el-form-item label="统计单位" prop="period">
        <el-select v-model="queryParams.period" placeholder="请选择统计单位" clearable size="small">
          <el-option
            v-for="dict in periodOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8"> 
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['stock:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['stock:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['stock:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['stock:info:export']"
        >导出</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading" :data="infoList"   >
      <el-table-column label="企业名称" align="center" prop="enterpriseName" />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
       <el-table-column label="统计时间" align="center" prop="time" />
      <el-table-column label="入库重量" align="center" prop="iWeight" />
      <el-table-column label="出库重量" align="center" prop="eWeight" />
      <el-table-column label="库存数" align="center" prop="zWeingt" />
     <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
           <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="inStock(scope.row)"
          >入库详情</el-button>
             <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="outStock(scope.row)"
          >出库详情</el-button>
        </template>
</el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改动植物申报对话框 -->
    <import-table ref="import" @ok="handleQuery" />
  </div>
</template>

<script>
import {
  UpdateSGoodsInfo,
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
  exportInfo,
  putInfo,
  selectInfo,
  getSGoodsDetail
} from "@/api/stock/info";
import importTable from "./importTable";
export default {
   components: { importTable },
  name: "Info",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 库存信息表格数据
      infoList: [],
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
        optime:undefined,
       period:undefined
      },
      // 表单参数
      form: {
       sGoodsType : "0"
      },
      // 时间组件
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }] },
     
    };  
  },
  created() {
     this.getDicts("station_period").then(response => {
      this.periodOptions = response.data;
    });
    this.getList();
  },
  methods: {
    /** 查询库存信息列表 */
    getList() {
   
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows; 
        this.total=response.total
      });
       this.loading=false
    },
   /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
     /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
/**出库流水 */
  outStock(rows){
   this.openAddDialog( rows.enterpriseName+rows.warehouseName+rows.time+"出库流水",rows.warehouseId,rows.enterpriseId,rows.time,rows.period,'E')
},
/**入库流水 */
  inStock(rows){
   this.openAddDialog( rows.enterpriseName+rows.warehouseName+rows.time+"入库流水",rows.warehouseId,rows.enterpriseId,rows.time,rows.period,'I')
},
    /** 打开新增弹窗 */
    openAddDialog(title,wid,eid,time,period,direction) {
      this.$refs.import.title =title;
      this.$refs.import.visible=true;
      this.$refs.import.queryParams.warehouseId=wid;
      this.$refs.import.queryParams.enterpriseId=eid;
      this.$refs.import.queryParams.time=time;
      this.$refs.import.queryParams.period=period;
      this.$refs.import.queryParams.direction=direction
      this.$refs.import.show();
    },

  }
};
</script>


