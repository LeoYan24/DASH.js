import FactoryMaker from '../../../core/FactoryMaker.js';

function BBARule() {
    const lowThreshold = 10;
    const highThreshold = 30;

    const instance = {
        getMaxIndex: function (rulesContext) {
            const abrController = rulesContext.getAbrController();
            const mediaInfo = rulesContext.getMediaInfo();
            const bufferLevel = rulesContext.getBufferState().getBufferLevel();
            const bitrateList = abrController.getBitrateList(mediaInfo);

            if (!bitrateList || bitrateList.length === 0) return -1;
            if (bufferLevel === undefined) return bitrateList.length - 1;

            let targetBitrateIndex;

            if (bufferLevel <= lowThreshold) {
                targetBitrateIndex = 0; // 最低码率
            } else if (bufferLevel >= highThreshold) {
                targetBitrateIndex = bitrateList.length - 1; // 最高码率
            } else {
                // 线性插值
                const ratio = (bufferLevel - lowThreshold) / (highThreshold - lowThreshold);
                const maxIndex = bitrateList.length - 1;
                targetBitrateIndex = Math.floor(ratio * maxIndex);
            }

            // 保证索引有效
            targetBitrateIndex = Math.min(Math.max(targetBitrateIndex, 0), bitrateList.length - 1);
            return targetBitrateIndex;
        }
    };

    return instance;
}

BBARule.__dashjs_factory_name = 'BBARule';
export default FactoryMaker.getClassFactory(BBARule);