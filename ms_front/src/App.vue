<style scoped>
.layout {
  border       : 1px solid #d7dde4;
  background   : #f5f7f9;
  position     : relative;
  border-radius: 4px;
  overflow     : hidden;
}
.layout-logo {
  width        : 100px;
  height       : 30px;
  background   : #5b6270;
  border-radius: 3px;
  float        : left;
  position     : relative;
  top          : 15px;
  left         : 20px;
}
.layout-nav {
  width       : 420px;
  margin      : 0 auto;
  margin-right: 20px;
}
.title{
  color: #ddd;
  font-size: 30px;
  text-align: center;
}
</style>
<template>
  <div class="layout">
    <div v-if="login">
      <Layout>
      <Header class="title">
        图&nbsp;书&nbsp;管&nbsp;理&nbsp;系&nbsp;统
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="" theme="light" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                Item 1
              </template>
              <MenuItem name="1-1">
              <router-link to="/user">用户管理</router-link>
              </MenuItem>
              <MenuItem name="1-2">
              <router-link to="/cate">分类管理</router-link>
              </MenuItem>
              <MenuItem name="1-3">
              <router-link to="/info">新闻管理</router-link>
              </MenuItem>
              
              <MenuItem name="1-5">
              <router-link to="/order">订单管理</router-link>
              </MenuItem>
              <MenuItem name="1-6">
              <router-link to="/product">产品管理</router-link>
              </MenuItem>
              <MenuItem name="1-7">
              <router-link to="/cart">购物车管理</router-link>
              </MenuItem>
              <MenuItem name="1-8">
              <router-link to="/help">帮助中心</router-link>
              </MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                Item 2
              </template>
              <MenuItem name="2-1">Option 1</MenuItem>
              <MenuItem name="2-2">Option 2</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                Item 3
              </template>
              <MenuItem name="3-1">Option 1</MenuItem>
              <MenuItem name="3-2">Option 2</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Components</BreadcrumbItem>
            <BreadcrumbItem>Layout</BreadcrumbItem>
          </Breadcrumb>
          <Content :style="{padding: '24px', paddingBottom:'100px', minHeight: '280px', background: '#fff'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    </div>
    <div v-else>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="name">
          <Input type="text" v-model="formInline.name" placeholder="Username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
        </FormItem>
      </Form>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      formInline: {
        name    : '',
        password: ''
      },
      ruleInline: {
        name: [
          {
            required: true,
            message : '请输入用户名',
            trigger : 'blur'
          }
        ],
        password: [
          {
            required: true,
            message : '请输入密码',
            trigger : 'blur'
          },
          {
            type   : 'string',
            min    : 6,
            message: '密码长度不得少于6位',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions(['checkLogin', 'setToken']),
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.checkLogin(true);
          this.setToken(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiYWEiLCJwYXNzd29yZCI6IjExMjIyMlF3In0sImlhdCI6MTU0MTY4MzI0Nn0.BT6cNtoyd8g1KPVrxLvJ97Wdm-XqAnkIfMYfk24cF4Q'
          );
          this.$Message.success('Success!');
        } else {
          this.$Message.error('Fail!');
        }
      });
    }
  },
  computed: {
    login() {
      return this.$store.getters.login;
    }
  }
};
</script>


