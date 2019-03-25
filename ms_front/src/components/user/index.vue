<template>
  <div>
    <Button type="primary" @click="addData()">添加数据</Button>
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
        <FormItem label="密码" prop="password">
          <Input v-model="formValidate.password" placeholder="请输入密码"></Input>
        </FormItem>
         <FormItem label="年龄" prop="age">
          <Input v-model="formValidate.age" placeholder="请输入年龄" number></Input>
        </FormItem>
         <FormItem label="性别" prop="sex">
         <RadioGroup v-model="formValidate.sex">
            <Radio label="男"></Radio>
            <Radio label="女"></Radio>
        </RadioGroup>
        </FormItem>
         <FormItem label="爱好" prop="hobby">
            <RadioGroup v-model="formValidate.hobby">
            <Radio label="打篮球"></Radio>
            <Radio label="打羽毛球"></Radio>
            <Radio label="打乒乓球"></Radio>
          </RadioGroup>
        </FormItem>
         <FormItem label="高度" prop="height">
          <Input v-model="formValidate.height" placeholder="请输入身高" number></Input>
        </FormItem>
         <FormItem label="体重" prop="weight">
          <Input v-model="formValidate.weight" placeholder="请输入体重" number></Input>
        </FormItem>
          <FormItem label="居住城市" prop="hometown" placeholder="请输入居住城市">

         <Select v-model="formValidate.hometown" >
            <Option value="北京">北京</Option>
            <Option value="上海">上海</Option>
            <Option value="深圳">深圳</Option>
       </Select>
        </FormItem>
          <FormItem label="地址" prop="address">
          <Input v-model="formValidate.address" placeholder="请输入地址"></Input>
        </FormItem>
          <FormItem label="个人中心" prop="brief">
           <quill-editor v-model="formValidate.brief"></quill-editor>
         <!-- <Input v-model="formValidate.brief" placeholder="请输入个人中心"></Input> -->
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div slot="footer">
        请认真填写信息
      </div>
    </Modal>
  </div>
</template>
<script>
import Base from '../../base/Base';
export default {
   mixins: [Base],
  data() {
    return {
        searchBox:"",
      formValidate: {
        name    : '',
        password: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message : '请输入用户名',
            // trigger : 'blur'
          }
        ],
        password: [
          {
            pattern : /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
            required: true,
            message : '请输入数字和字母至少6位',
            // trigger : 'blur'
          }
        ],
        age: [
          {
            required: true,
            type:'number',
            message : '请输入年龄',
            // trigger : 'blur'
          }
        ],
        sex:[
          {
            require:true,
            message:'请输入性别',
          }
        ],
        height:[
          {
             required: true,
            type:'number',
            message : '请输入身高',
          }
        ] ,
          weight:[
          {
             required: true,
            type:'number',
            message : '请输入体重',
          }
        ],
         hometown:[
          {
         required: true,
          message : '请输入城市',
          }
         ],
          address:[
          {
         required: true,
          message : '请输入具体地址',
          }
         ],
          brief:[
            {
             required: true,
             message : '请输入个人中心',
            }
          ]
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
          title: '密码',
          key  : 'password'
        },
        {
         title:'年龄',
         key:'age'
        },
        {
        title:'性别',
        key:'sex'
        },
        {
        title:'爱好',
        key:'hobby'

        },
        {
       title:'身高',
       key:'height'
        },
        {
       title:'体重',
       key:'weight'
        },
        {
       title:'居住城市',
       key:'hometown'
        },
        {
        title:'地址',
        key:'address'
        },
        {
        title:'个人中心',
        key:'brief',
        render: function(h,params){
        return h('div',{
        domProps:{
        innerHTML: params.row.brief
        },
        });
        }
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
            //  console.log(this.formValidate._id);
            if (valid) {
            if (this.formValidate._id) {
                this.axios({
                url: `http://localhost:3000/users/data/${
                    this.formValidate._id
                }`,
                method: 'put',
                data  : this.formValidate
                }).then(res => {
                this.modalForm = false;
                this.getData(this.formValidate.type);
                });
            } else {
                if(this.formValidate.parentId==''){
                    delete this.formValidate.parentId;
                }
                console.log(this.formValidate);
                this.axios({
                url   : `http://localhost:3000/users/data`,
                method: 'post',
                data  : this.formValidate
                }).then(res => {
                this.modalForm = false;
                this.getData(this.formValidate.type);
                });
            }

            } else {
            this.$Message.error('Fail!');
            }
        });
    },
    addData(){
      this.handleReset("formValidate");
      delete this.formValidate._id;
      console.log(this.formValidate);
      this.modalForm=true;
    },
    onSearch(){
     this.axios({
       url:`http://localhost:3000/${this.module}/list`,
       method:'post',
       data:{
        name:this.searchBox,
        page: 1,
        rows: this.rows
       }
     }).then(res => {
      this.total = res.data.total;
      this.data  = res.data.rows;
    });
   },

   onChangePage(page) {
      this.page = page;
      if(this.searchBox){
        this.onSearch();
      }else{
        this.getData();
      }
      // this.getData();
      // this.searchBox();
    },
  onPageSizeChange(rows) {
      this.rows = rows;
      if(this.searchBox){

        this.onSearch();
      }else{
        this.getData();
      }
    },

  }
};

</script>
