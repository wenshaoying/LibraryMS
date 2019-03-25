<template>
  <div>
    <Button type="primary" @click="modalForm = true">添加数据</Button>
    <Button type="primary" @click="removes">删除多个</Button>
     <Input suffix="ios-search" placeholder="Enter text" style="width: auto" v-model="searchBox"/>
    <Button type="primary" @click="onSearch">search</Button> 
    <Table border :columns="columns" :data="data" @on-selection-change="onSelect"></Table>
    <Page :total="total" :page-size="rows" @on-change="onChangePage" :page-size-opts=[5,10,15,20] @on-page-size-change="onPageSizeChange" show-sizer />

    <Modal v-model="modalForm" title="数据操作">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="加购" prop="cart">
          <!-- <Input v-model="formValidate.cart" placeholder="请输入购物内容"></Input> -->
          <!-- <button @click="setEditorContent">Set Editor Contents</button>
           <vue-editor v-model="formValidate.cart"></vue-editor><button @click="setEditorContent">Set Editor Contents</button>
           <vue-editor v-model="formValidate.cart"></vue-editor> -->
           <quill-editor v-model="formValidate.cart"></quill-editor>

        </FormItem>
         <FormItem label="商品名" prop="title">
          <Input v-model="formValidate.title" placeholder="请输入商品名"></Input>
        </FormItem>
         <FormItem label="数量" prop="number">
          <Input v-model="formValidate.number" placeholder="请输入数量" number></Input>
        </FormItem>
         <FormItem label="价格" prop="price">
          <Input v-model="formValidate.price" placeholder="请输入价格" number></Input>
        </FormItem>
        
          <FormItem label="E-mail" prop="email">
            <Input v-model="formValidate.email" placeholder="Enter your e-mail"></Input>
        </FormItem>
        <!-- <FormItem label="日期" prop="date">
            <Input v-model="formValidate.date" placeholder="Enter your 日期"> </Input>
        </FormItem> -->
        <!-- <FormItem label="日期">
            <Row>
                <Col span="11">
                    <DatePicker type="time" placeholder="Select time" v-model="formValidate.date"></DatePicker>
                </Col>
               <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
                </Col> 
            </Row>
        </FormItem> -->
            
                    <!-- <FormItem label="Date" prop="date">
                        <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                    </FormItem> -->
           <input type="hidden" name="date">
            
        
          
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div slot="footer">
        请认真填写内容
      </div>
    </Modal>
  </div>
</template>
<script>

import Base from '../../base/Base';
import moment from "moment";
export default {
 
   mixins: [Base],
  
  data() {

    return {
       htmlForEditor: null,
       module       : 'cart',
       formValidate : {
        name  : "",
        cart  : "",
        title : "",
        number: "",
        price : "",
        email : "",
        date  : ""
      },
      ruleValidate: {
        name  : [{ required: true, message: "必须输入用户名",  }],
        cart  : [{ required: true, message: "购物车", }],
        title : [{ required: true, message: "商品名",  }],
        number: [{ required: true,type:'number', message: "数量",  }],
        price : [{ required: true,type:'number', message: "价格",  }],
        email : [
          {
            required: true, message: "邮箱",
          },
          //{ type: "email", message: "Incorrect email format", trigger: "blur" }
        ],
      // date:[{ required: false,type:'string', message: "时间", }],
        // date: [
        //   {
        //     required: true,
        //     type: "date",
        //     trigger: "blur",
        //    message: "Please select the date",
        //    trigger: "change"
        //   }
        // ]
      },
      columns: [
        {
          type : 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key  : 'name'
        },
       {
          title : "加购",
          key   : "cart",
          render: function(h,params){
          return h('div',{
          domProps:{
          innerHTML: params.row.cart
          },
          });
          }

        },
        {
          title: "商品名",
          key  : "title"
        },
        {
          title: "数量",
          key  : "number"
        },
        {
          title: "总价格",
          key  : "price"
        },
        {
          title: "邮箱",
          key  : "email"
        },
        {
          title: "日期",
          key  : "date",
          //   render: (h, params) => {
          //   return h('div', moment(params.row.date).format('YYYY/MM/DD'))
            
          // }
          // render: (h, params) => {
          //   return h(
          //     "div",
          //     moment(params.row.createdate).format("YYYY-MM-DD HH:mm:ss")
          //   );
          // }

         
        },
        {
          title : '操作',
          key   : 'action',
          width : 150,
          align : 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row._id);
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // console.log(params);
                      this.remove(params.row._id);
                    }
                  }
                },
                '删除'
              )
            ]);
          }
        }
      ]
    };
  },
  
 methods:{
     handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                   
                 
                    //修改
                    if (this.formValidate._id) {
                   this.formValidate.date = moment().format('YYYY-MM-DD HH:mm:ss');
                        this.axios({
                            url: `http://localhost:3000/${this.module}/data/${
                this.formValidate._id
              }`,
                            method: 'put',
                            data  : this.formValidate
                        }).then(res => {
                            this.modalForm = false;
                            this.getData();
                            //数据重置
                            this.$data.formValidate = this.$options.data().formValidate;
                        });
                        //增加
                    } else {
                      this.formValidate.date = moment().format('YYYY-MM-DD HH:mm:ss');
                        this.axios({
                            url   : `http://localhost:3000/${this.module}/data`,
                            method: 'post',
                            data  : this.formValidate
                        }).then(res => {
                            this.modalForm = false;
                            this.getData();
                            this.$refs['formValidate'].resetFields();
                           
                        });
                    }
                } else {
                    this.$Message.error('Fail!');
                }
            });
        },
          onSearch(){
            this.axios({
              url   : `http://localhost:3000/${this.module}/list`,
              method: 'post',
              data  : {
              name: this.searchBox,
              page: this.page,
              rows: this.rows
              }
            }).then(res => {
            this.total = res.data.total;
            this.data  = res.data.rows;
          });
          },
          setEditorContent: function() {
            this.cart = '<h1>Html For Editor</h1>'
          }
  }
};
</script>
