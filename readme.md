# CPP-COMP

## <u> Vision </u>

This is a command line inteface that helps me with my cpp projects. It runs on node js that helps compile all cpp files into an execution file. it can be configured, through a config.json file or through cli arguments. Good luck with c++ lad, hope you survive.

## <u> Basics Compilation</u>

So at the most basic level, this cli will take all .cpp files that it finds in a source folder, compiles them down to .o files, then the linker will do finish up the process and an execution file will be made. lets compile a basic .cpp project.

to compile, input the following in the cli <br>
<span style="color:red"> don't worry if you have an empty prject file, cpp-comp will auto-generate a source directory and a main.cpp file </span>

```
$ cpp-comp
```

If you really want to know, here's the compilation process (**NB**: this is a very dumbed down explanation):

1. Take all .cpp files, and compile down to .o files
2. Take all the .o files and link them to build the .exe file
3. Enjoy the .exe you just made

## <u> File Watching </u>

In order to watch files, you can do it one of the folowing ways

- in the CLI:

```
$ cpp-comp -w
```

or

```
$ cpp-comp --watch
```

- in the compile.config.json

```
{
    ...
    "watch": true,
    ...
}
```
