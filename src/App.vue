<template>
  <div id="app">
    <div class="container">
      <p class="mv3 f3 tc">{{ title }}</p>
      <div class="mw9 center">
        <nav class="mb3">
          <input class="fl w-third ml2" type="text" placeholder="search" v-model="searchQuery">

          <div class="fl w-third ">
            <p class="mv0 ml2 tl di">Sort by name:</p>
            <button @click="sortContactsByName('desc')" :class="nameDescClass">&#8595;</button>
            <button @click="sortContactsByName('asc')" :class="nameAscClass">&#8593;</button>
          </div>

          <div>
            <p class="mv0 ml1 tl di">Sort by phone:</p>
            <button @click="sortContactsByPhone('desc')" :class="phoneDescClass">&#8595;</button>
            <button @click="sortContactsByPhone('asc')" :class="phoneAscClass">&#8593;</button>
          </div>
        </nav>
      </div>

      <div v-if="contactList.length" class="contacts mb4">
        <div v-for="contact in contactList" class="contact card mb3" :key="contact.phone_number">
          <p class="mb2 f4">{{ contact.name }}</p>
          <p class="mt0 mb2">{{ contact.phone_number }}</p>
          <p class="ma0"> {{ contact.address }}</p>
        </div>
      </div>
      <p :class="emptyClass" v-else>{{ emptyMessage }}</p>
    </div>

  </div>
</template>

<script>
const naturalCompare = require('string-natural-compare');
const api = require('./api');
export default {
  name: 'app',
  created() {
    const that = this;
    api.fetchData(function(data) {
      that.cleanContactList = data.contacts;
      that.contactList = that.cleanContactList;
    }, function(e) {
      console.log(e);
    });
  },
  data() {
    return {
      emptyMessageColor: 'blue',
      title: 'Phonebook',
      contactList: [],
      cleanContactList: [],
      emptyMessage: "Loading",
      searchQuery: '',
      sortProp: '',
      sortOrder: '',
    }
  },
  computed: {
    emptyClass() {
      return `pl3 pv3 ${this.emptyMessageColor} fw5 contacts`;
    },
    nameAscClass() {
      return `ml1 ${this.sortProp === 'name' && this.sortOrder === 'asc' ? 'blue' : ''}`
    },
    nameDescClass() {
      return `ml1 ${this.sortProp === 'name' && this.sortOrder === 'desc' ? 'blue' : ''}`
    },
    phoneAscClass() {
      return `ml1 ${this.sortProp === 'phone_number' && this.sortOrder === 'asc' ? 'blue' : ''}`
    },
    phoneDescClass() {
      return `ml1 ${this.sortProp === 'phone_number' && this.sortOrder === 'desc' ? 'blue' : ''}`
    },
  },
  methods: {
    /**
     * Toggles the sort order between ascending and descending
     */
    toggleSortOrder() {
      // TODO: toggleSortIcon order
      // sort only if data is loaded and renderedContacts array is not empty
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    sortContactsByName(sortOrder) {
      if (this.sortProp !== 'name') {
        this.sortProp = 'name';
      }
      this.sortOrder = sortOrder;
      this.sortContacts();
    },
    sortContactsByPhone(sortOrder) {
      if (this.sortProp !== 'phone_number') {
        this.sortProp = 'phone_number';
      }
      this.sortOrder = sortOrder;
      this.sortContacts();
    },
    /**
     * Sorts a contact list
     * @param  {Array} contactList - array of contact objects
     * @param  {string} sortProp - the property to sort by, has to be an existing property of contact object
     * @param  {string} order - `des` for descending order or `asc` for ascending order
     */
    sortContacts() {
      const sortProp = this.sortProp;
      const order = this.sortOrder;
      this.contactList.sort(function(a, b) {
        //  Compare alphanumeric strings the same way a human would, using a natural order algorithm
        return order === 'desc' ? naturalCompare(a[sortProp], b[sortProp]) : naturalCompare(b[sortProp], a[sortProp]);
      });
    },
    filterContacts(query) {
      this.contactList = this.cleanContactList.filter(function(contact) {
        return contact.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
          contact.phone_number.indexOf(query.toLowerCase()) > -1;
      });
      this.sortContacts();
      if (!this.contactList.length) {
        this.emptyMessage = 'No match found';
        this.emptyMessageColor = 'red';
      }
    },
  },
  watch: {
    searchQuery(query) {
      this.filterContacts(query);
    }
  }
}
</script>

<style lang="scss">
@import "node_modules/tachyons-sass/tachyons.scss";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #42b983;
}

.container {
  max-width: 580px;
  margin: 0 auto;
}

.contacts {
  border: 1px solid #efefef;
}

.contact.card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
