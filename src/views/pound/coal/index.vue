<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="submitForm"
          v-hasPermi="['measurement:sheet:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['measurement:sheet:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-refresh-right" size="mini" @click="cancel">重置</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" class="fa fa-print" size="mini" @click="print">打印</el-button>
      </el-col>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
      <!-- 左侧开始 -->
      <el-row>
        <el-col :span="6">
          <el-form-item label="发货单位" prop="finalInspectionTime">
            <el-input v-model="form.finalInspectionTime" placeholder="请输入发货单位" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="车牌号" prop="plateNum">
            <el-input v-model="form.plateNum" placeholder="请输入车牌号" />
          </el-form-item>
        </el-col>
        <!-- 蒙文键盘 -->
        <el-col :span="1">
          <el-popover placement="right" width="500" trigger="click">
            <SimpleKeyboard @onChange="onChange" :input="form.plateNum" />
            <el-button slot="reference" class="fa fa-keyboard-o" size="mini"></el-button>
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-form-item label="货物名称" prop="specification">
            <el-input v-model="form.specification" placeholder="请输入货物名称" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="收货单位" prop="receivingUnit">
            <el-input v-model="form.receivingUnit" placeholder="请输收货单位" />
          </el-form-item>
        </el-col>
        <!-- 左侧结束 -->
      </el-row>
      <el-row>
        <!-- 右侧开始 -->
        <el-col :span="6">
          <el-form-item label="毛重" prop="grossWeight">
            <el-input v-model="form.grossWeight" placeholder="请输入毛重" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="皮重" prop="tare">
            <el-input v-model="form.tare" placeholder="请输入皮重" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="箱皮重" prop="NetTareWeight">
            <el-input v-model="form.NetTareWeight" placeholder="请输入箱皮重" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="净重" prop="netWeight">
            <el-input v-model="form.netWeight" placeholder="请输入净重" />
          </el-form-item>
        </el-col>
        <!-- 右侧结束 -->
      </el-row>
      <!-- 底部三个 -->
      <el-row>
         <el-col :span="24">
          <el-form-item label="箱 号" prop="CaseNumber">
            <el-input v-model="form.CaseNumber" placeholder="请输入箱号" />
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
         <el-col :span="24">
          <el-form-item label="提煤单号" prop="CoalMentionNumber">
            <el-input v-model="form.CoalMentionNumber" placeholder="请输入提煤单号" />
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
         <el-col :span="24">
          <el-form-item label="备注" prop="Remarks">
            <el-input v-model="form.Remarks" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      <!-- 底部结束 -->

    <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="cancel"
          v-hasPermi="['measurement:sheet:export']"
        >导出</el-button>
    </el-col>-->

    <el-table v-loading="loading" :data="sheetList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="计量员" align="center" prop="id" />
      <el-table-column label="末检时间" align="center" prop="finalInspectionTime" />
      <el-table-column label="计量号" align="center" prop="measurementNum" />
      <el-table-column label="车牌号" align="center" prop="plateNum" />
      <el-table-column label="货物名称" align="center" prop="goodsName" />
      <el-table-column label="规格" align="center" prop="specification" />
      <el-table-column label="承运人" align="center" prop="carrier" />
      <el-table-column label="皮重" align="center" prop="tare" />
      <el-table-column label="毛重" align="center" prop="grossWeight" />
      <el-table-column label="净重" align="center" prop="netWeight" />
      <el-table-column label="供货单位" align="center" prop="deliveryUnit" />
      <el-table-column label="收货单位" align="center" prop="receivingUnit" />
      <el-table-column label="流向" align="center" prop="flowDirection" />
      <el-table-column label="计量员" align="center" prop="measurer" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['measurement:sheet:edit']"
          >修改</el-button>
           <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="preview(scope.row)"
          >预览</el-button>
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

    <!-- 添加或修改计量单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="末检时间" prop="finalInspectionTime">
              <el-input v-model="form.finalInspectionTime" placeholder="请输入末检时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量号" prop="measurementNum">
              <el-input v-model="form.measurementNum" placeholder="请输入计量号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="plateNum">
              <el-input v-model="form.plateNum" placeholder="请输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货物名称" prop="goodsName">
              <el-input v-model="form.goodsName" placeholder="请输入货物名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="form.specification" placeholder="请输入规格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承运人" prop="carrier">
              <el-input v-model="form.carrier" placeholder="请输入承运人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="皮重" prop="tare">
              <el-input v-model="form.tare" placeholder="请输入皮重" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毛重" prop="grossWeight">
              <el-input v-model="form.grossWeight" placeholder="请输入毛重" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="净重" prop="netWeight">
              <el-input v-model="form.netWeight" placeholder="请输入净重" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供货单位" prop="deliveryUnit">
              <el-input v-model="form.deliveryUnit" placeholder="请输入供货单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收货单位" prop="receivingUnit">
              <el-input v-model="form.receivingUnit" placeholder="请输入收货单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流向" prop="flowDirection">
              <el-input v-model="form.flowDirection" placeholder="请输入流向" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="计量员" prop="measurer">
          <el-input v-model="form.measurer" placeholder="请输入计量员" />
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
// import {
//   listSheet,
//   getSheet,
//   delSheet,
//   addSheet,
//   updateSheet,
//   exportSheet,
// } from "@/api/pound/poundlist";
import SimpleKeyboard from "@/components/SimpleKeyboard/SimpleKeyboard";
import printTemplate from "print-template";
export default {
  name: "Sheet",
  components: {
    SimpleKeyboard,
  },
  data() {
    return {
      name: { type: "text", x: 8, y: 45, fontSize: 3.5 },
      code: {
        type: "barcode",
        x: 7,
        y: 13,
        format: "CODE128A",
        width: 4,
        margin: 0,
        fontSize: 3.3,
      },
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
      // 计量单表格数据
      sheetList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        finalInspectionTime: undefined,
        measurementNum: undefined,
        plateNum: undefined,
        goodsName: undefined,
        
        specification: undefined,
        carrier: undefined,
        tare: undefined,
        grossWeight: undefined,
        netWeight: undefined,
        deliveryUnit: undefined,
        receivingUnit: undefined,
        flowDirection: undefined,
        measurer: undefined,
      },
      // 表单参数
      form: { plateNum: undefined,
      NetTareWeight:undefined,
      CaseNumber:undefined,
      CoalMentionNumber:undefined,
      Remarks:undefined,
      },
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询计量单列表 */
    getList() {
      this.loading = true;
      listSheet(this.queryParams).then((response) => {
        this.sheetList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 关闭弹窗/清空表头
    cancel() {
      this.reset();
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        finalInspectionTime: undefined,
        measurementNum: undefined,
        plateNum: undefined,
        goodsName: undefined,
        NetTareWeight:undefined,
        specification: undefined,
        carrier: undefined,
        tare: undefined,
        grossWeight: undefined,
        netWeight: undefined,
        deliveryUnit: undefined,
        receivingUnit: undefined,
        flowDirection: undefined,
        measurer: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加计量单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSheet(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改计量单";
      });
    },
    preview(row) {
      const id = row.id || this.ids;
      getSheet(id).then((response) => {
        this.form = response.data;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSheet(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.cancel();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSheet(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.cancel();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除计量单编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delSheet(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有计量单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSheet(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    onChange(input) {
      console.log("输出" + input);
      this.form.plateNum = input;
    },
    //打印功能
    print() {
      var myDate = new Date();
      console.log("aa");
      let template = new printTemplate();
      console.log("bb");
      let yto = {
        name: "yto", // 模板名称
        unit: "mm", // 尺寸 默认mm    mm / px
        size: [130, 70], // 模板大小  宽 130mm / 高70mm
        // fixed: [
        //  // 固定内容 比如：线条 、logo 广告、固定字体
        //  // 第一条
        //   { type: "line", x: 1, y: 12, length: 110 },
        //   //第二条
        //   { type: "line", x: 1, y: 18, length: 110 },
        //   //第三条
        //   { type: "line", x: 1, y: 24, length: 110 },
        //   //第四条
        //   { type: "line", x: 1, y: 30, length: 110 },
        //   //第五条
        //   { type: "line", x: 1, y: 36, length: 110 },
        //   //第六条
        //   { type: "line", x: 1, y: 42, length: 110 },
        //   //第七条
        //   { type: "line", x: 1, y: 48, length: 110 },
        //   //左侧第一条
        //   { type: "line", x: 1, y: 12, orientation: "p", length: 36 },
        //   //左侧第二条
        //   { type: "line", x: 16, y: 12, orientation: "p", length: 36 },
        //   //左侧第三条
        //   { type: "line", x: 57, y: 12, orientation: "p", length: 36 },
        //   //左侧第四条
        //   { type: "line", x: 70, y: 12, orientation: "p", length: 36 },
        //   //右侧第一条
        //   { type: "line", x: 111, y: 12, orientation: "p", length: 36 },
        //  // 公司名称
        //   {
        //     type: "text",
        //     fontSize: 4,
        //     fontWeight: 100,
        //     x: 2,
        //     y: 1,
        //     default: "内蒙古额济纳旗庆华马克那林苏海特商贸有限责任公司",
        //   }, // 固定文字   \n 换行  也可以设置 maxWidth:3.8*2  自动换行
        //   //计量单标题
        //   {
        //     type:"text",
        //     fontSize:2.6,
        //     x:53,
        //     y:7,
        //     default:"计量单",
        //   },
        //   //盖章区
        //   {
        //     type:"text",
        //     fontSize:1.8,
        //     fontWeight:100,
        //     x:2,
        //     y:10,
        //     default:"( 盖 章 有 效 )",
        //   },
        //   //票号
        //    {
        //     type:"text",
        //     fontSize:1.8,
        //     fontWeight:100,
        //     x:67,
        //     y:10,
        //     default:"票号 Q H M K:",
        //   },
        //   //末检时间
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:6,
        //     y:14.5,
        //     default:"末 检 时 间",
        //   },
        //   //车号
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:6,
        //     y:20.5,
        //     default:"车         号",
        //   },
        //   //规格
        //    {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:6,
        //     y:26.5,
        //     default:"规         格",
        //   },
        //   //承运人
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:6,
        //     y:32.5,
        //     default:"承  运  人",
        //   },
        // //供货单位
        // {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:5.5,
        //     y:38.5,
        //     default:"供 货 单 位",
        //   },
        //   //收货单位
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:5.5,
        //     y:44.5,
        //     default:"收 货 单 位",
        //   },
        //   //计量号
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:60,
        //     y:14.5,
        //     default:"计  量  号",
        //   },
        //   //货物名称
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:59.5,
        //     y:20.5,
        //     default:"货 物 名 称",
        //   },
        //   //毛重(kg)
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:60,
        //     y:26.5,
        //     default:"毛 重 (kg)",
        //   },
        //   //皮重(kg)
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:60,
        //     y:32.5,
        //     default:"皮 重 (kg)",
        //   },
        //   //净重(kg)
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:60,
        //     y:38.5,
        //     default:"净 重 (kg)",
        //   },
        //   //备注
        //   {
        //     type:"text",
        //     fontSize:1.7,
        //     fontWeight:100,
        //     x:60,
        //     y:44.5,
        //     default:"备         注",
        //   },
        // ],
        data: {
          //右侧 X轴 71  左侧X轴  20
          // 动态数据 传入值的位置
          //口岸公司名称
          PortCompanyPreview:{type: 'text', x: 23, y: 1, fontSize: 4},
          //日期
          datePreview:{type: 'text', x: 20, y: 8, fontSize: 3},
          //时间
          timePreview:{type: 'text', x: 50, y: 8, fontSize: 3},
          //第一排开始

          //发货单位
          ShipperPreview:{type: 'text', x: 20, y: 14, fontSize: 3},
          //收货单位
          ReceivingUnitPreview:{type: 'text', x: 20, y: 19, fontSize: 3},
          //货物名称
          itemNamePreview:{type: 'text', x: 20, y: 26, fontSize: 3},
          //车号
          CarNumberPreview:{type: 'text', x: 20, y: 32, fontSize: 3},
          //第一排结束

          //第二排开始

           //毛重
           grossWeightPreview:{type: 'text', x: 75, y: 14, fontSize: 3},
           //皮重
           tarePreview:{type: 'text', x: 75, y: 20, fontSize: 3},
           //箱皮重
           NetTareWeightPreview:{type: 'text', x: 75, y: 26, fontSize: 3},
           //净重
           netWeightPreview:{type: 'text', x: 75, y: 32, fontSize: 3},
           //第二排结束
          
          //底部三排
          //箱号
            CaseNumberPreview:{type: 'text', x: 20, y: 38, fontSize: 3},
          //提煤单号
            CoalMentionNumberPreview:{type: 'text', x: 20, y: 44, fontSize: 3},
          //备注
            RemarksPreview:{type: 'text', x: 20, y: 50, fontSize: 3},
            // 第三排结束
            
          //   type: "barcode",
          //   x: 7,
          //   y: 13,
          //   format: "CODE128A",
          //   width: 4,
          //   margin: 0,
          //   fontSize: 3.3,
          //   fontOptions: "bold",
          //   displayValue: true,
          //   height: 13,
          // },
        },
      };
      // 添加模板
      template.push(yto);
      
      // 传入数据的内容
      let data = [
        { 
          //口岸公司名称
          PortCompanyPreview:'甘其毛都华方海关监管场所称重单',
         //日期
         datePreview:myDate.toLocaleDateString(),
         //时间
         timePreview:myDate.toLocaleTimeString(),
          //发货单位
          ShipperPreview:this.form.finalInspectionTime,
          //收货单位
          ReceivingUnitPreview:this.form.receivingUnit,
          //货物名称
          itemNamePreview:this.form.specification,
          //车号
          CarNumberPreview:this.form.plateNum,
           //毛重
          grossWeightPreview:this.form.grossWeight,
          //皮重
          tarePreview:this.form.tare,
          //箱皮重
          NetTareWeightPreview:this.form.NetTareWeight,
          //净重
          netWeightPreview:this.form.netWeight,
         //箱号
         CaseNumberPreview:this.form.CaseNumber,
         //提煤单号
         CoalMentionNumberPreview:this.form.CoalMentionNumber,
         //备注
         RemarksPreview:this.form.Remarks,
           },
        // { name: "张三2", code: "YT100011112" },
      ];
      // 打印
      console.log(this.form.goodsName);
      console.log("aaa"+this.form.measurementNum);
      template.print("yto", data).then((pdf) => {
        // 返回 jspdf
        // blob 地址
        let uri = pdf.output("bloburi", { filename: "磅单PDF生成" });
        // 下载保存
        pdf.save("磅单打印");
      });
    },
  },
};
</script>