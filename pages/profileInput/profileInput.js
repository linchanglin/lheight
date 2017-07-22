import common from '../../utils/common.js';

Page({
    data: {},
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        
        that.setData({
            wesecret: wesecret,
            userInfo: my_userInfo,
        })
    },
    onShow: function () {
        let that = this;
        let profile_need_refresh = wx.getStorageSync('profile_need_refresh')
        if (profile_need_refresh) {
            let my_userInfo = wx.getStorageSync('my_userInfo');
            
            that.setData({
                userInfo: my_userInfo,
            })
            wx.removeStorageSync('profile_need_refresh')
        }
    },
    navigateToAvatarUrlInput: function () {
        wx.navigateTo({
            url: '../avatarUrlInput/avatarUrlInput',
        })
    },
    navigateToNicknameInput: function () {
        wx.navigateTo({
            url: '../nicknameInput/nicknameInput',
        })
    },
    navigateToGenderInput: function () {
        wx.navigateTo({
            url: '../genderInput/genderInput',
        })
    },
    navigateToCollegeInput: function () {
        wx.navigateTo({
            url: '../provinceInput/provinceInput',
        })
    },
    navigateToInterestInput: function () {
        let my_userInfo = wx.getStorageSync('my_userInfo');
        let interest_id = my_userInfo.interest_id;
        
        wx.navigateTo({
            url: `../interestInput/interestInput?interest_id=${interest_id}`,
        })
    },
    navigateToProfileDetailsInput: function () {
        wx.navigateTo({
            url: '../profileDetailsInput/profileDetailsInput',
        })
    }
});