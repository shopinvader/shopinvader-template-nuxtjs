<template>
  <div>
    <template v-if="slider">
      <div class="image-slider" ref="sliderElement">
        <div
          v-for="(image, index) in images"
          :id="'item' + index"
          ref="item"
          class="image-slider__item"
          :key="'img-' + index"
        >
          <NuxtPicture
            v-if="image.large?.src"
            :src="image.large?.src"
            class="item-image"
            :class="zoom ? 'image-zoom' : ''"
            :alt="image.large?.alt"
            :title="image.large?.alt"
            :img-attrs="{ height: 500 }"
            :placeholder="img(image.large?.src, { h: 500, f: 'webp', q: 10 })"
            format="webp"
            @click="onImageZoom(image)"
          />
        </div>
      </div>
      <ul class="slider-indicators">
        <li
          v-for="(image, index) in images"
          :key="'img-indicator' + index"
          class="slider-indicators__items"
          @click="slideCarousel(index + 1)"
        >
          <nuxt-img
            :src="image.medium?.src"
            class="items-image"
            :alt="image.medium?.alt"
            :title="image.medium?.alt"
            :height="70"
            :width="70"
            :placeholder="img(image.small?.src || '', { h: 70, f: 'webp', blur: 2, q: 10 })"
          />
        </li>
      </ul>
      <div class="slider-indicators-mobile">
        <div
          v-for="(image, index) in images"
          :key="'img-indicator' + index"
          @click="slideCarousel(index + 1)"
          ref="indicators"
          class="slider-indicators-mobile__items"
        >
          <icon name="radix-icons:dot-filled" class="items-icons"></icon>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="w-full rounded">
        <div
          v-for="(image, index) in images"
          :id="'item' + index"
          class="w-full bg-gray-100"
          :key="'img-' + index"
        >
          <nuxt-img
            :src="image.large?.src"
            :alt="image.large?.alt"
            :title="image.large?.alt"
            :class="zoom ? 'product-image-zoom' : ''"
            class="mx-auto max-h-full min-h-max w-full p-6"
          />
        </div>
      </div>
    </template>

    <client-only>
      <aside-drawer :open="selectedImage!== null" class-content="image-zoom" @close="selectedImage = null">
        <template #content>
          <div v-if="selectedImage && selectedImage?.xlarge" class="image-zoom__zoom">
            <figure
              @mousemove="onImageHover"
              class="zoom__image"
              :style="`background-image: url(${img(selectedImage?.xlarge?.src, { h: 1500, f: 'webp', blur: 0, q: 100 })})`"
            >
              <NuxtPicture
                v-if="selectedImage.xlarge?.src"
                :src="selectedImage.xlarge?.src"
                :alt="selectedImage.xlarge?.alt"
                :title="selectedImage.xlarge?.alt"
                height="1000"
                quality="1000"
                :placeholder="img(selectedImage.xlarge?.src, { h: 1000, f: 'webp', blur: 2, q: 10 })"
                format="webp"
              />
            </figure>
            <ul class="zoom__indicators">
              <li
                v-for="(image, index) in images"
                :key="'modal-indicator' + index"
                class="indicators__items"
                :class="selectedImage === image ? 'indicators__items__selected' : ''"
                @click="selectedImage = image"
              >
                <nuxt-img
                  :src="image.medium?.src"
                  class="items-image"
                  :alt="image.medium?.alt"
                  :title="image.medium?.alt"
                  :height="120"
                  :width="120"
                  :placeholder="img(image.medium?.src || '', { h: 120, f: 'webp', blur: 2, q: 10 })"
                />
              </li>
            </ul>
          </div>
        </template>
        <template #footer>
          <div>
            <button class="btn btn-primary" @click="selectedImage = null">
              {{ $t('actions.close') }}
            </button>
          </div>
        </template>
      </aside-drawer>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import  { type ProductImageSet } from '#models'
defineProps({
  images: {
    type: Array as PropType<ProductImageSet[]>,
    required: true
  },
  slider: {
    type: Boolean
  },
  zoom: {
    type: Boolean,
    default: true
  }
})
const img = useImage()
const sliderElement = ref()
const selectedImage = ref<ProductImageSet | null>(null)
const slideCarousel = (goToImageNumber: number) => {
  const carouselContainer: HTMLElement = sliderElement.value as HTMLElement
  const carouselWidth = carouselContainer?.clientWidth
  const targetImage = goToImageNumber - 1
  const targetXPixel = carouselWidth * targetImage + 1
  carouselContainer?.scrollTo(targetXPixel, 0)
}

const onImageZoom = (img:ProductImageSet) => {
  selectedImage.value = img
}

const onImageHover = (e:MouseEvent) => {
  const zoomer = e.currentTarget as HTMLElement;
  if(zoomer) {
    const x = e.offsetX/zoomer.offsetWidth*100
    const y = e.offsetY/zoomer.offsetHeight*100
    zoomer.style.backgroundPosition = x + '% ' + y + '%';
  }

}
</script>
<style lang="scss">
.image-slider {
  @apply carousel w-full items-center rounded max-md:h-full min-h-[500px];
  &__item {
    @apply carousel-item h-full w-full items-center justify-center max-md:max-h-96;
  }
  .item-image {
    img {
      @apply mx-auto max-h-96 min-h-max p-6 object-contain max-sm:w-full lg:max-h-[500px] cursor-zoom-in;
    }
  }
}
.slider-indicators {
  @apply hidden w-full items-center justify-center gap-2 py-2 lg:flex flex-wrap;
  &__items {
    @apply cursor-pointer rounded bg-gray-100 hover:bg-gray-200 w-16 h-16 overflow-hidden flex items-center justify-center;
    .items-image {
      @apply mx-auto object-fill p-2;
    }
  }
}
.slider-indicators-mobile {
  @apply flex flex-wrap w-full justify-center gap-1 py-6 lg:hidden;
  &__items {
    @apply h-full transition  ease-linear;
    .items-icons {
      @apply text-lg;
    }
  }
}
.aside-drawer__side.image-zoom {
  @apply w-screen max-w-full lg:max-w-7xl;
  .image-zoom__zoom {
    @apply flex flex-col lg:flex-row items-start justify-center gap-2 w-full;
    .zoom {
      &__image {
        background-position: 50% 50%;
        background-size: 2000px;
        background-repeat: no-repeat;
        @apply overflow-hidden cursor-zoom-in w-full relative ;
        img {
          @apply cursor-zoom-in hover:opacity-0 block w-full bg-white;
          transition: opacity .5s;
        }
      }
      &__indicators {
        @apply flex flex-row lg:flex-col gap-1 lg:gap-2 items-center;
        .indicators__items {
          @apply card card-bordered overflow-hidden cursor-pointer w-20 h-20 flex items-center justify-center;
          &__selected {
            @apply border-primary-500;
          }
        }
      }
    }
  }
}
</style>
