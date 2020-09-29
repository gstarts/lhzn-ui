<template class="max">
  <div class="welcome" :style="'width:'+width+';height:'+height">
    欢迎光临
    <!-- <div class="all"> -->

    <!-- 场站是否显示 MARK为下方定义的场站显示标示 -->
    <!-- <div v-if="MARK === 'B'"> -->
    <!-- 第一排 -->
    <!-- <el-row :gutter="10">
          <el-col :span="5">
            <div class="L1-1">
              <ve-ring :data="demo03" :settings="demo003"></ve-ring>
            </div>
          </el-col>
          <el-col :span="14">
    <el-row :gutter="10">-->
    <!-- 场内车辆 -->
    <!-- <el-col :span="6">
                <div class="L1-2">
                  场内车辆:
                  <span>36</span>
                </div>
    </el-col>-->
    <!-- 场内货物 -->
    <!-- <el-col :span="8">
                <div class="L1-2">
                  场内货物:
                  <span>17686(吨)</span>
                </div>
    </el-col>-->
    <!-- 单据 -->
    <!-- <el-col :span="5">
                <div class="L1-2">
                  单据:
                  <span>43</span>
                </div>
    </el-col>-->
    <!-- 合作企业 -->
    <!-- <el-col :span="5">
                <div class="L1-2">
                  合作企业:
                  <span>26</span>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <div class="L1-3">
              <span class="FontSize">通关异常车辆统计</span>
              <ve-pie :data="demo08" :settings="demo008"></ve-pie>
            </div>
          </el-col>
    </el-row>-->
    <!-- 第二排 -->
    <!-- <el-row :gutter="10">
          <el-col :span="5">
            <div class="L2-1">
              <div class="FontSize">货物细节</div>
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="CargoName" label="货物名称" width="100%"></el-table-column>
                <el-table-column prop="Warehouse" label="所属仓库" width="100%"></el-table-column>
                <el-table-column prop="Neiweight" label="重量(吨)"></el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="L2-2">
              <ve-line
                :data="demo02"
                width="100%"
                height="300px"
                ref="tubiaoTest"
                :toolbox="toolbox"
              ></ve-line>
            </div>
    </el-col>-->
    <!-- <el-col :span="5"> -->
    <!-- <div class="L2-3"> -->
    <!-- <div class="FontSize">场内车辆</div>
              <div class="FontStyle">
                <el-row>
                  <el-col :span="8">车号</el-col>
                  <el-col :span="8">单号</el-col>
                  <el-col :span="8">入场时间</el-col>
                </el-row>
    </div>-->
    <!-- <el-carousel :interval="6000" height="190px" direction="vertical"> -->
    <!-- <el-carousel-item v-for="item in 3" :key="item"> -->
    <!-- 测试数据 -->
    <!-- <div>
                  <ul class="UlStyle">
                    <li>辽A65S52</li>
                    <li>010101010125</li>
                    <li>13.24分</li>
                  </ul>
                  <ul class="UlStyle">
                    <li>辽A58714</li>
                    <li>010684247982</li>
                    <li>13.01分</li>
                  </ul>
                  <ul class="UlStyle">
                    <li>辽A13274</li>
                    <li>010978466311</li>
                    <li>13.54分</li>
                  </ul>
                  <ul class="UlStyle">
                    <li>辽A98578</li>
                    <li>017865454612</li>
                    <li>13.23分</li>
                  </ul>
                  <ul class="UlStyle">
                    <li>辽A69853</li>
                    <li>011256143045</li>
                    <li>13.24分</li>
                  </ul>
                  <ul class="UlStyle">
                    <li>辽A25781</li>
                    <li>010567925742</li>
                    <li>13.26分</li>
                  </ul>
    </div>-->
    <!-- </el-carousel-item> -->
    <!-- </el-carousel> -->
  </div>
  <!-- </el-col> -->
  <!-- </el-row> -->
  <!-- 第三排 -->
  <!-- <el-row :gutter="10">
          <el-col :span="5">
            <div class="L3-1">
              <ve-bar :data="demo05" height="280px" :colors="color01"></ve-bar>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="L3-2">
              <ve-histogram :data="demo01" height="500px"></ve-histogram>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="L3-3">
              <ve-bar :data="demo06" height="400px" :colors="color03"></ve-bar>
            </div>
          </el-col>
  </el-row>-->
  <!-- 第四排 -->
  <!-- <el-row :gutter="10">
          <el-col :span="5">
            <div class="L4-1">
              <ve-bar :data="demo04" :settings="demo004" height="240px"></ve-bar>
            </div>
          </el-col>
  </el-row>-->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </div> -->
</template>

<script>
import {} from "@/api/waybill/declare";
export default {
  name: "Index",
  data() {
    this.demo002 = {
      xAxisType: "value",
    };
    this.demo003 = {
      radius: [60, 40],
      offsetY: 85,
    };
    this.demo004 = {
      stack: {
        aaa: ["访问用户", "下单用户", "下单率"],
      },
    };

    this.demo006 = {
      metrics: ["车辆数"],
      dataOrder: {
        label: "车辆数",
        order: "desc",
      },
    };

    this.demo008 = {
      roseType: "radius",
      radius: 80,
      offsetY: 120,
    };
    return {
      height: 100,
      width: 100,
      //场站显示标识(待定)
      MARK: "B",
      //颜色样式
      color01: ["rgb(255, 215, 0)"],
      color03: ["#FF8C69"],

      tableData: [
        {
          CargoName: "民用汽车",
          Warehouse: "A号仓库",
          Neiweight: "200",
        },
        {
          CargoName: "医疗用品",
          Warehouse: "B号仓库",
          Neiweight: "10",
        },
        {
          CargoName: "农业产品",
          Warehouse: "C号仓库",
          Neiweight: "300",
        },
        {
          CargoName: "进口石油",
          Warehouse: "D号仓库",
          Neiweight: "400",
        },
        {
          CargoName: "工业零件",
          Warehouse: "A号仓库",
          Neiweight: "60",
        },
      ],
      demo02: {
        columns: ["时间", "国内车辆", "国外车辆", "特种车辆"],
        rows: [
          { 时间: "一", 国内车辆: 30, 国外车辆: 43, 特种车辆: 11 },
          { 时间: "二", 国内车辆: 48, 国外车辆: 63, 特种车辆: 5 },
          { 时间: "三", 国内车辆: 20, 国外车辆: 38, 特种车辆: 21 },
          { 时间: "四", 国内车辆: 72, 国外车辆: 65, 特种车辆: 23 },
          { 时间: "五", 国内车辆: 55, 国外车辆: 45, 特种车辆: 30 },
          { 时间: "六", 国内车辆: 63, 国外车辆: 62, 特种车辆: 26 },
          { 时间: "七", 国内车辆: 11, 国外车辆: 23, 特种车辆: 15 },
          { 时间: "八", 国内车辆: 63, 国外车辆: 43, 特种车辆: 8 },
        ],
      },
      demo01: {
        columns: ["企业", "库存(吨)"],
        rows: [
          { 企业: "忠胜货运", "库存(吨)": 300 },
          { 企业: "鑫盛货运", "库存(吨)": 1000 },
          { 企业: "创亿货运", "库存(吨)": 500 },
          { 企业: "诺赛德货运", "库存(吨)": 720 },
          { 企业: "东盛货运", "库存(吨)": 360 },
          { 企业: "捷顺货运", "库存(吨)": 200 },
          { 企业: "泰捷货运", "库存(吨)": 720 },
          { 企业: "帆顺货运", "库存(吨)": 720 },
          { 企业: "启恒货运", "库存(吨)": 840 },
          { 企业: "景扬货运", "库存(吨)": 540 },
          { 企业: "驰纳货运", "库存(吨)": 960 },
        ],
      },
      demo03: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "集装箱申报数", 访问用户: 672 },
          { 日期: "动植物申报数", 访问用户: 368 },
        ],
      },
      demo04: {
        columns: ["企业名", "入库数", "出库数"],
        rows: [
          { 企业名: "忠胜货运", 入库数: 800, 出库数: 765 },
          { 企业名: "鑫盛货运", 入库数: 200, 出库数: 110 },
          { 企业名: "创亿货运", 入库数: 400, 出库数: 365 },
          { 企业名: "诺赛德货运", 入库数: 500, 出库数: 235 },
          { 企业名: "东盛货运", 入库数: 365, 出库数: 132 },
        ],
      },
      demo05: {
        columns: ["仓库名称", "库存数(吨)"],
        rows: [
          { 仓库名称: "A号仓库", "库存数(吨)": 2000 },
          { 仓库名称: "B号仓库", "库存数(吨)": 1587 },
          { 仓库名称: "C号仓库", "库存数(吨)": 3000 },
          { 仓库名称: "D号仓库", "库存数(吨)": 4225 },
          { 仓库名称: "E号仓库", "库存数(吨)": 6874 },
        ],
      },
      demo06: {
        columns: ["卡口名称", "车次"],
        rows: [
          { 卡口名称: "A类卡口", 车次: 156 },
          { 卡口名称: "B类卡口", 车次: 132 },
          { 卡口名称: "异常卡口", 车次: 36 },
          { 卡口名称: "正常通关卡口", 车次: 227 },
          { 卡口名称: "C类卡口", 车次: 140 },
          { 卡口名称: "D类卡口", 车次: 155 },
        ],
      },
      demo08: {
        columns: ["通关异常车辆数量", "车次"],
        rows: [
          { 通关异常车辆数量: "6~9(h)", 车次: 10 },
          { 通关异常车辆数量: "10~12(h)", 车次: 7 },
          { 通关异常车辆数量: "1~3(h)", 车次: 9 },
          { 通关异常车辆数量: "4~5(h)", 车次: 7 },
        ],
      },
      //配置显示折线图/柱状图切换按钮以及另存为图片按钮。
      toolbox: {
        feature: {
          magicType: { type: ["line", "bar", "radar"] },
          saveAsImage: {},
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.height = document.body.clientHeight - 84 + "px";
      this.width = document.body.clientWidth + "px";

      window.onresize = () => {
        this.height = document.body.clientHeight - 84 + "px";
        this.width = document.body.clientWidth + "px";
      };
    });
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

.FontSize {
  padding-top: 10px;
  padding-left: 20px;
  color: rgb(99, 99, 99);
  font-size: 17px;
  font-weight: bold;
}
.welcome {
  //首页背景渐变色
  background: #7f7fd5; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to top,
    #91eae4,
    #86a8e7,
    #7f7fd5
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to top,
    #91eae4,
    #86a8e7,
    #7f7fd5
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

//首页字体
  color: #304352;
  margin: 0 auto;
  text-align: center;
  font-size: 70px;
  padding-top: 17%;
}
.FontStyle {
  text-align: center;
  color: rgb(99, 99, 99);
  font-size: 15px;
  font-weight: bold;
}
.CargoFontStyle {
  text-align: center;
  padding-top: 15px;
  color: rgb(99, 99, 99);
  font-size: 15px;
  font-weight: bold;
}
.max {
  background: rgb(233, 9, 9);
}
.all {
  color: rgb(136, 136, 136);
  font-size: 100px;
  text-align: center;
  padding-top: 15%;
}
.L1-1 {
  border-radius: 10px;
  background: rgb(247, 247, 247);
  width: 100%;
  height: 150px;
  color: blanchedalmond;
}
.L1-2 {
  border-radius: 10px;
  font-size: 20px;
  background: rgb(247, 247, 247);
  text-align: center;
  width: 100%;
  height: 100px;
  line-height: 100px;
  color: rgb(99, 99, 99);
}
.L1-2 span {
  font-size: 35px;
}
.L1-2:hover {
  color: rgb(255, 255, 255);
  background: rgb(124, 124, 124);
}
.L1-3 {
  border-radius: 10px;
  background: rgb(247, 247, 247);
  width: 100%;
  height: 260px;
  padding-top: 20px;
}
.L2-1 {
  overflow: auto;
  border-radius: 10px;
  background: rgb(247, 247, 247);
  width: 100%;
  height: 250px;
  margin-top: -100px;
}
.L2-2 {
  border-radius: 10px;
  background: rgb(247, 247, 247);
  padding: 60px;
  width: 100%;
  height: 300px;
  margin-top: -150px;
}
.L2-3 {
  line-height: 30px;
  border-radius: 10px;
  background: rgb(247, 247, 247);
  width: 100%;
  height: 240px;
  margin-top: 10px;
}
.UlStyle {
  justify-content: center;
  display: flex;
}
.UlStyle li {
  font-weight: bold;
  font-size: 15px;
  line-height: 30px;
  padding-right: 30px;
  list-style: none;
  float: left;
  color: rgb(0, 0, 0);
}
.L3-1 {
  border-radius: 10px;
  background: rgb(247, 247, 247);
  width: 100%;
  height: 250px;
  margin-top: -90px;
}
.L3-2 {
  border-radius: 10px;
  background: rgb(247, 247, 247);
  width: 100%;
  height: 460px;
  margin-top: -90px;
}
.L3-3 {
  border-radius: 10px;
  background: rgb(247, 247, 247);
  width: 100%;
  height: 340px;
  margin-bottom: 10px;
  margin-top: 30px;
}
.L4-1 {
  border-radius: 10px;
  background: rgb(247, 247, 247);
  width: 100%;
  height: 200px;
  margin-top: -210px;
}
//右侧轮播图
.el-carousel__item:nth-child(2n) {
  background-color: rgb(247, 247, 247);
  height: 240px;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: rgb(247, 247, 247);
}
.YSYS {
  font-size: 100px;
}
</style>