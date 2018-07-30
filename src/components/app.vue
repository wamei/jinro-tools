<template>
  <div @click="hideToolTip()" class="body">
    <nav class="navbar navbar-expand-lg navbar-dark bg-info">
      <span class="navbar-brand">人狼殺考察補助ツール</span>
    </nav>
    <div class="container">
      <div class="d-flex flex-row">
        <div class="p-2 bg-light">
          <p>部屋</p>
        </div>
        <div class="p-2" role="group" aria-label="部屋">
          <button v-for="(item, index) in rooms" type="button" :class="selectedRoom != index ? 'btn btn-secondary' : 'btn btn-info'" @click="changeRoom(index)">{{ item.name }}</button>
        </div>
      </div>
      <div class="d-flex flex-row pl-5">
        <div class="pb-1 pl-1" v-for="(item, index) in roomClassList">
          <span type="button" :class="convertToStyle('badge', classList[item].style)">{{ classList[item].name }}</span>
        </div>
      </div>
      <div class="d-flex flex-row">
        <div class="p-2 bg-light">
          <p>席次</p>
        </div>
        <div class="p-2" role="group" aria-label="席次">
          <button v-for="(item, index) in roomClassList" type="button" :class="myIndex != index ? 'btn btn-secondary' : 'btn btn-info'" @click="changeIndex(index)">{{ index + 1 }}</button>
          <button type="button" class="btn" @click="reset()">リセット</button>
        </div>
      </div>
      <div class="main">
        <div class="users">
          <div v-for="index in numberOfUser" class="user" :id="'user_' + (index - 1)">
            <div class="menu-tooltip" v-show="users[index-1].menuIsShown" style="position:absolute;top:-120px;">
              <div class="menu-content">
                <div class="d-flex flex-row">
                  <div class="p-2 bg-light">
                    <p>役職　</p>
                  </div>
                  <div class="p-2" role="group" aria-label="役職">
                    <button v-for="(item, i) in userClassList" type="button" :class="convertToStyle('btn', classList[item].style)" @click.stop="changeUserClass(index - 1, item)">{{ classList[item].name }}</button>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <div class="p-2 bg-light">
                    <p>占い　</p>
                  </div>
                  <div class="p-2" role="group" aria-label="占い">
                    <button v-for="(item, i) in roomClassList" type="button" :class="convertToFortuneStyle(index - 1, calcRUserIndex(i + 1))" @click.stop="toggleFortune(index - 1, calcRUserIndex(i + 1))">{{ i + 1 }}</button>
                    <button type="button" class="btn btn-light" @click.stop="resetFortune(index - 1)">リセット</button>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <div class="p-2 bg-light">
                    <p>生死　</p>
                  </div>
                  <div class="p-2" role="group" aria-label="生死">
                    <button type="button" :class="convertToAliveStatusStyle(index - 1, 0)" @click.stop="changeUserAliveStatus(index - 1, 0)">生存</button>
                    <button type="button" :class="convertToAliveStatusStyle(index - 1, 1)" @click.stop="changeUserAliveStatus(index - 1, 1)">吊られ</button>
                    <button type="button" :class="convertToAliveStatusStyle(index - 1, 2)" @click.stop="changeUserAliveStatus(index - 1, 2)">噛まれ</button>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <div class="p-2 bg-light">
                    <p>ライン</p>
                  </div>
                  <div class="p-2" role="group" aria-label="ライン">
                    <button v-for="(item, i) in roomClassList" type="button" :class="convertToLineStyle(index - 1, calcRUserIndex(i + 1))" @click.stop="toggleLine(index - 1, calcRUserIndex(i + 1))">{{ i + 1 }}</button>
                    <button type="button" class="btn btn-light" @click.stop="resetLine(index - 1)">リセット</button>
                  </div>
                </div>
              </div>
            </div>
            <div :class="convertToCardStyle(index-1)" @click.stop="showToolTip(index-1)" @mouseover="overUser(index-1)" @mouseleave="leaveUser(index-1)">
              <div class="card-header">
                {{ calcUserIndex(index) }}
              </div>
              <div class="card-body">
                <span :class="convertToStyle('badge', classList[users[index-1].class].style)">{{ classList[users[index-1].class].name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="considering">
        席をクリックでメニュー表示<br>
        占いとラインは複数回押して切り替え<br><br><br><br>
        <textarea v-model="memo" rows="25"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
const LINE_TYPE_ASSOC   = 'line';
const LINE_TYPE_FORTUNE = 'fortune';
const defaultUser = {
    class: 0,
    menuIsShown: false,
    isHanged: false,
    isByted: false,
    lines: [],
    fortunes: [],
    memo: '',
};
export default {
    data() {
        const rooms = [
            {
                name: '6人村',
                classList: [
                    3, 3, 4, 5, 6, 6
                ],
            },
            {
                name: '9人村(狂人なし)',
                classList: [
                    3, 3, 3, 3, 7, 4, 5, 6, 6
                ],
            },
            {
                name: '9人村(狂人あり)',
                classList: [
                    3, 3, 3, 7, 4, 5, 6, 6, 8
                ],
            },
            {
                name: '12人村',
                classList: [
                    3, 3, 3, 3, 7, 4, 5, 10, 6, 6, 6, 9
                ],
            },
        ];
        const users = [];
        rooms[rooms.length - 1].classList.forEach((elm, index) => {
            users[index] = {};
            Object.keys(defaultUser).forEach((key) => {
                if (Array.isArray(defaultUser[key])) {
                    users[index][key] = [...defaultUser[key]];
                } else {
                    users[index][key] = defaultUser[key];
                }
            });
        });
        return {
            memo: '',
            selectedRoom: 0,
            rooms,
            myIndex: 0,
            myClass: 0,
            classList: [
                {
                    name: '？　',
                    style: 'secondary',
                },
                {
                    name: '白　',
                    style: 'light',
                },
                {
                    name: '黒　',
                    style: 'dark',
                },
                {
                    name: '村人',
                    style: 'primary',
                },
                {
                    name: '占い師',
                    style: 'primary',
                },
                {
                    name: '狩人',
                    style: 'primary',
                },
                {
                    name: '人狼',
                    style: 'danger',
                },
                {
                    name: 'ﾊﾝﾀｰ',
                    style: 'primary',
                },
                {
                    name: '狂人',
                    style: 'success',
                },
                {
                    name: '妖狐',
                    style: 'warning',
                },
                {
                    name: '霊能者',
                    style: 'primary',
                },
            ],
            users,
        };
    },
    computed: {
        roomClassList() {
            return this.rooms[this.selectedRoom].classList;
        },
        myClassList() {
            return [...new Set(this.rooms[this.selectedRoom].classList)];
        },
        userClassList() {
            return [0,1,2,...new Set(this.rooms[this.selectedRoom].classList)];
        },
        numberOfUser() {
            return this.roomClassList.length;
        },
    },
    methods: {
        changeRoom(index) {
            this.selectedRoom = index;
            this.$nextTick(() => {
                const deg = 360.0/this.numberOfUser;
                const red = (deg*Math.PI/180.0);
                const width = $("div.user").width();
                const height = $("div.user").height();
                const circle_r = width * 2.5;
                $('div.user').each(function(i, elem) {
                    var x = Math.cos(red * i + Math.PI/2) * circle_r + circle_r;
                    var y = Math.sin(red * i + Math.PI/2) * circle_r + circle_r;
                    $(elem).css('left', x - width / 2);
                    $(elem).css('top', y -height / 2);
                });
                $(`.userLine`).remove();
                this.rooms[this.rooms.length - 1].classList.forEach((elm, index) => {
                    this.users[index].lines.forEach((elm) => {
                        if (!elm) {
                            return;
                        }
                        this.drawLine(LINE_TYPE_ASSOC, index, elm.to, elm.type);
                    });
                    this.users[index].fortunes.forEach((elm) => {
                        if (!elm) {
                            return;
                        }
                        this.drawLine(LINE_TYPE_FORTUNE, index, elm.to, elm.type);
                    });
                });
            });
        },
        changeClass(index) {
            this.myClass = index;
            this.users[0].class = this.myClass;
        },
        changeUserClass(index, classIndex) {
            if (index == 0) {
                this.changeClass(classIndex);
            } else {
                this.users[index].class = classIndex;
            }
            this.hideToolTip();
        },
        changeUserAliveStatus(index, status) {
            switch(status) {
                case 0:
                    this.users[index].isByted = false;
                    this.users[index].isHanged = false;
                    break;
                case 1:
                    this.users[index].isByted = false;
                    this.users[index].isHanged = true;
                    break;
                case 2:
                    this.users[index].isByted = true;
                    this.users[index].isHanged = false;
                    break;
            }
            this.hideToolTip();
        },
        changeIndex(index) {
            this.myIndex = index;
        },
        calcUserIndex(index) {
            return (index + this.myIndex - 1) % this.numberOfUser + 1;
        },
        calcRUserIndex(index) {
            return (index - 1 - this.myIndex + this.numberOfUser) % this.numberOfUser;
        },
        convertToStyle(type, modifier, appendix) {
            return `${type} ${type}-${modifier} ${appendix}`;
        },
        convertToAliveStatusStyle(index, type) {
            let style = 'btn-secondary';
            if (type == 1 && this.users[index].isHanged) {
                style = 'btn-dark';
            } else if (type == 2 && this.users[index].isByted) {
                style = 'btn-danger';
            }
            return `btn ${style}`;
        },
        convertToFortuneStyle(from, to) {
            let style = 'btn-secondary';
            const index = this.getFortuneIndex(from, to);
            if(index != -1) {
                if (this.users[from].fortunes[index].type == 0) {
                    style = 'btn-success';
                } else {
                    style = 'btn-danger';
                }
            };
            return `btn ${style}`;
        },
        getFortuneIndex(from, to) {
            let index = -1;
            this.users[from].fortunes.forEach((elm, i) => {
                if (elm.to == to) {
                    index = i;
                }
            });
            return index;
        },
        toggleFortune(from, to) {
            let index = this.getFortuneIndex(from, to);
            if (index != -1) {
                if (this.users[from].fortunes[index].type == 1) {
                    this.users[from].fortunes.splice(index, 1);
                    $(`#fortune_${from}_${to}`).remove();
                } else {
                    this.users[from].fortunes[index].type++;
                    $(`#fortune_${from}_${to}`).css('border', `1px solid ${this.getLineColor(this.users[from].fortunes[index].type)}`);
                    $(`#fortune_${from}_${to}`).css('color', this.getLineColor(this.users[from].fortunes[index].type));
                }
                return;
            } else {
                this.users[from].fortunes.push({
                    to: to,
                    type: 0,
                });
                this.drawLine(LINE_TYPE_FORTUNE, from, to, 0);
            }
        },
        resetFortune(index) {
            this.users[index].fortunes.splice(0, this.users[index].fortunes.length);
            $(`.fortune_from_${index}`).remove();
        },
        convertToLineStyle(from, to) {
            let style = 'btn-secondary';
            const index = this.getLineIndex(from, to);
            if(index != -1) {
                if (this.users[from].lines[index].type == 0) {
                    style = 'btn-success';
                } else {
                    style = 'btn-danger';
                }
            };
            return `btn ${style}`;
        },
        convertToCardStyle(index) {
            let bg = '';
            if (this.users[index].isHanged) {
                bg = 'bg-dark dead';
            } else if (this.users[index].isByted) {
                bg = 'bg-danger dead';
            }
            return `card ${bg}`;
        },
        getLineIndex(from, to) {
            let index = -1;
            this.users[from].lines.forEach((elm, i) => {
                if (elm.to == to) {
                    index = i;
                }
            });
            return index;
        },
        getLineColor(type) {
            if (type == 0) {
                return '#aaa';
            } else {
                return '#faa';
            }
        },
        toggleLine(from, to) {
            let index = this.getLineIndex(from, to);
            if (index != -1) {
                if (this.users[from].lines[index].type == 1) {
                    this.users[from].lines.splice(index, 1);
                    $(`#line_${from}_${to}`).remove();
                } else {
                    this.users[from].lines[index].type++;
                    $(`#line_${from}_${to}`).css('border', `1px solid ${this.getLineColor(this.users[from].lines[index].type)}`);
                    $(`#line_${from}_${to}`).css('color', this.getLineColor(this.users[from].lines[index].type));
                }
                return;
            } else {
                this.users[from].lines.push({
                    to: to,
                    type: 0,
                });
                this.drawLine(LINE_TYPE_ASSOC, from, to, 0);
            }
        },
        resetLine(index) {
            this.users[index].lines.splice(0, this.users[index].lines.length);
            $(`.line_from_${index}`).remove();
        },
        drawLine(lineType, from, to, type) {
            const $line = $(`<div id="${lineType}_${from}_${to}" class="userLine ${lineType}_from_${from} ${lineType}_to_${to} line_type_${lineType}"></div>`);
            const $from = $(`#user_${from}`);
            const $to = $(`#user_${to}`);
            const width = $("div.user").width();
            const height = $("div.user").height();
            const hwidth = width / 2;
            const hheight = height / 2;
            const x1 = $from.position().left + hwidth;
            const x2 = $to.position().left + hwidth;
            const y1 = $from.position().top + hheight;
            const y2 = $to.position().top + hheight;
            const len = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            const deg = 180 / Math.PI * Math.atan2(y2 - y1, x2 - x1);
            const thin = lineType == LINE_TYPE_ASSOC ? 1 : 5;
            $line.css({
                left : x1,
                top : y1,
                width : len,
                transform : `rotate(${deg}deg)`,
                position: 'absolute',
                height: `${thin}px`,
                color: this.getLineColor(type),
                'border': `1px solid ${this.getLineColor(type)}`,
                'transform-origin': 'left top'
            });
            $line.appendTo($('div.users'));
        },
        overUser(index) {
            $(`.userLine:not(.line_from_${index}, .line_to_${index}, .fortune_from_${index}, .fortune_to_${index})`).css('opacity', 0.01);
            $(`.userLine.line_to_${index}`).css('border-style', 'dashed');
        },
        leaveUser(index) {
            $(`.userLine`).css({
                opacity: 1,
                'border-style': 'solid',
            });
        },
        showToolTip(index) {
            this.hideToolTip();
            this.users[index].menuIsShown = true;
        },
        hideToolTip(index) {
            if (index == void 0) {
                this.users.forEach((item) => {
                    item.menuIsShown = false;
                });
                return;
            }
            this.users[index].menuIsShown = false;
        },
        reset() {
            this.hideToolTip();
            this.changeClass(0);
            $(`.userLine`).remove();
            this.memo = '';
            this.rooms[this.rooms.length - 1].classList.forEach((elm, index) => {
                Object.keys(this.users[index]).forEach((key) => {
                    if (Array.isArray(defaultUser[key])) {
                        this.users[index][key] = [...defaultUser[key]];
                    } else {
                        this.users[index][key] = defaultUser[key];
                    }
                });
                this.memo += `${index+1}. \n\n`;
            });
        },
    },
    mounted() {
        this.changeRoom(this.selectedRoom);
        this.changeClass(this.myClass);
        this.changeIndex(this.myIndex);
        this.reset();
    },
}
</script>

<style>
.body {
  width: 100%;
  height: 100%;
}
.container {
  margin-bottom: 200px;
}
.main {
  margin-top: 80px;
  position: relative;
  width: 100%;
}

.users {
  position: relative;
  margin: 0 auto;
  user-select: none;
}

.user {
  position: absolute;
  width: 100px;
  height: 100px;
}
.menu-tooltip {
  position: relative;
}
.menu-content {
  left: 105px;
  width: 650px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 3px;
  position: absolute;
  z-index: 1000;
}
.dead {
  opacity: 0.2;
}
.userLine {
  pointer-events: none;
}
.userLine::after {
  content: '>';
  position: absolute;
  right: -0.1em;
  top: -0.8em;
  font-size: 20pt;
}

.considering {
  margin-top: -200px;
  margin-left: 650px;
}
.considering .textblock {
  padding-right: 20px;
  width: 230px;
  float: left;
}
.considering textarea {
  width: 100%;
}
</style>
