
cmake_minimum_required(VERSION 3.22.1)

project("testappliction")

add_library(
        testappliction
        SHARED
        ${PROJECT_SOURCE_DIR}/src/main/cpp/native-lib.cpp)

include_directories(libnode/include/node/)

add_library( libnode
        SHARED
        IMPORTED )

set_target_properties(
        libnode
        PROPERTIES IMPORTED_LOCATION
        ${CMAKE_SOURCE_DIR}/libnode/bin/${ANDROID_ABI}/libnode.so )

find_library(
        log-lib
        log)

target_link_libraries(
        testappliction
        libnode
        ${log-lib})