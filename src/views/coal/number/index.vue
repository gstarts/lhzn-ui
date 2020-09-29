<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      
      <el-form-item label="车牌号" prop="plate">
        <el-input
          v-model="queryParams.plate"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />

      

      </el-form-item>
      <el-form-item label="状态" prop="spoilt">
        <el-select v-model="queryParams.spoilt" placeholder="请选择状态">
          <el-option
            v-for="dict in CancelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue">
          </el-option>
        </el-select>
      </el-form-item>


      
      <el-form-item label="录入时间" prop="dateTime">
        <el-date-picker clearable size="small" style="width: 250px"
          v-model="dateRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>


     
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
       <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['coal:number:add']"
        >新增</el-button>
      </el-col> -->
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['coal:number:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleFinish(scope.row)"
          v-hasPermi="['coal:number:remove']"
        >执行完毕</el-button>
      </el-col> -->

      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleFinish"
          v-hasPermi="['coal:plate:remove']"
        >执行完毕</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['coal:number:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="numberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="提煤单号" align="center" prop="coalNumber" />
      <el-table-column label="收货单位" align="center" prop="receivingUnit" />
      <el-table-column label="客户" align="center" prop="custom" />
      <el-table-column label="货物名称" align="center" prop="variety" />
      <!-- <el-table-column label="合同号" align="center" prop="contract" /> -->
      <el-table-column label="提煤量" align="center" prop="weight" />
      <el-table-column label="录入时间" align="center" prop="dateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dateTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="录入人" align="center" prop="operator" />-->
      <el-table-column label="状态" align="center" prop="spoilt" :formatter="eIsEnterpriseTypeFormat"/>
      
      <!-- <el-table-column label="作废标示" align="center" prop="remark" />
      <el-table-column label="作废标示" align="center" prop="securityKey" />
      <el-table-column label="执行完成标示" align="center" prop="finished" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="detail(scope.row)"
            v-hasPermi="['coal:number:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['coal:number:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-warning"
            @click="handleDelete(scope.row)"
            v-hasPermi="['coal:number:remove']"
          >作废</el-button>
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
    <!--新增-->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="提煤单号" prop="coalNumber">
          <el-input v-model="form.coalNumber" placeholder="请输入提煤单号" />
        </el-form-item>
        <el-form-item label="收货单位" prop="receivingUnit">
          <el-input v-model="form.receivingUnit" placeholder="请输入收货单位" />
        </el-form-item>
        <el-form-item label="客户" prop="custom">
          <el-input v-model="form.custom" placeholder="请输入客户" />
        </el-form-item>
        <el-form-item label="货物名称" prop="variety">
          <el-input v-model="form.variety" placeholder="请输入货物名称" />
        </el-form-item>
        <el-form-item label="合同号" prop="contract">
          <el-input v-model="form.contract" placeholder="请输入合同号" />
        </el-form-item>
        <el-form-item label="提煤量" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入提煤量" />
        </el-form-item>
        <el-form-item label="执行完成标示" prop="finished">
          <el-input v-model="form.finished" placeholder="请输入执行完成标示" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import { listNumber, getNumber, delNumber, addNumber, updateNumber, exportNumber,numberFinish } from "@/api/coal/number";
export default {
  name: "Number",
  data() {
    return {
      // 遮罩层
      loading: true,
      restaurants: [],
        
      state2: '',
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 日期范围
      dateRange:[],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // headid
      headId: undefined,
      // 【请填写功能名称】表格数据
      numberList: [],
      // 作废状态字典
      CancelOptions : [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        coalNumber: undefined,
        receivingUnit: undefined,
        custom: undefined,
        variety: undefined,
        contract: undefined,
        weight: undefined,
        dateTime: undefined,
        operator: undefined,
        spoilt: "2",
        securityKey: undefined,
        finished: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    /** 作废字典配置 */
    this.getDicts("station_options_type").then(response => {
      this.CancelOptions = response.data;
    });
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listNumber(this.addDateRange(this.queryParams,this.dateRange)).then(response => {
        this.numberList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    eIsEnterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.CancelOptions, row.spoilt);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        coalNumber: undefined,
        receivingUnit: undefined,
        custom: undefined,
        variety: undefined,
        contract: undefined,
        weight: undefined,
        dateTime: undefined,
        operator: undefined,
        spoilt: undefined,
        remark: undefined,
        securityKey: undefined,
        finished: undefined
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.coalNumber)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
        
            addNumber(this.form).then(response => {  
              // console.log("bbb");
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          
        }
      });
    },
  /*作废【大提煤单信息作废】*/
    handleDelete(row) {
      const coalNumber = row.coalNumber 
      this.$confirm('是否确认作废【提煤单信息】编号为"' + coalNumber + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNumber(coalNumber);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },

   /* 执行完成 */
  handleFinish(row){
      const coalNumbers =row.id || this.ids;
      // console.log(coalNumbers)
      this.$confirm('是否确认执行完成编号为"' + coalNumbers + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return numberFinish(coalNumbers);
        }).then(() => {
          this.getList();
          this.msgSuccess("执行成功");
        }).catch(function() {});
    },


    

    
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportNumber(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
     /**详情按钮 */
    detail(row) {     
      this.reset();
      const id = row.coalNumber || this.coalNumber;
      this.$router.push({ path: "/coallist/details", query: { tableId: id } });
    },
        /**修改按钮 */
    handleUpdate(row) {
      this.reset();
      const id = row.coalNumber || this.coalNumber;
      this.$router.push({ path: "/coallist/edit", query: { tableId: id } });
    },
    /** 车牌号联想 */
    // querySearch(queryString, cb) {
    //     var restaurants = this.restaurants;
    //     var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
    //     // 调用 callback 返回建议列表的数据
    //     cb(results);
    //   },
    //   createFilter(queryString) {
    //     return (restaurant) => {
    //       return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    //     };
    //   },
    //   loadAll() {        

    //   },
    //   handleSelect(item) {
    //     console.log(item);
    //   }
  },
  //  mounted() {
  //     this.restaurants = this.loadAll();
  //   }
};
</script>